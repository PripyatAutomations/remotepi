#!/usr/bin/perl
######
# XXX: Add timeout for the dtmf decoders
# XXX: Add timeouts for the $dtmf_announce_*_delay's
use strict;
use warnings;
use HTTP::Request::Common;
use IO::Async::Loop;
use IO::Async::Timer::Countdown;
use IO::Async::Stream;
use Net::Async::WebSocket::Client;
use JSON;
use Data::Dumper;
use Hamlib;
require LWP::UserAgent;

# disable linebuffering on output, so we can log easier
$| = 1;

####XXX: Move to config file####
my $debug = 0;
my $app_name = "remotepi";

my $ari = {
   "host" => "127.0.0.1",
   "port" => 8088,
   "prefix" => "/pbx/ari",
   "user" => "remotepi",
   "pass" => "remotepi"
};

my $station = {
   "callsign" => "N0CALL",
   "default_mode" => "",
#   "default_mode" => "phone",
   "gridsquare" => "FN19",
   "selcall_dtmf" => "987654321",
   "shutdown_dtmf" => "##90210352##"
};

my $client = {
   "chan_id" => "",
   "chan_name" => "",
   "current_bridge" => "",
   "permissions" => "*",		# * for all, admin,listen,speak
   "username" => "guest"
};

my $radio0 = {
   "active_vfo" => $Hamlib::RIG_VFO_A,
   "bridge_id" => "",
   "debug_level" => "bug",
   "dialstring" => "/dial 0\@127.0.0.1",	# SIP address to call into
   "freq_a" => 0,			# VFO A
   "freq_b" => 0,			# VFO B
   'if_shift' => 0,			# IF shift
   "model" => $Hamlib::RIG_MODEL_NETRIGCTL,
   "passbands" => {
      "am" => 6000,
      "cw" => 1000,
      "data" => 3000,
      "fm" => 12000,
      "ssb" => 3000
   },
   "ptt_start" => 0,			# Time TOT started
   "ptt_blocked" => 1,
   "ptt_active" => 0,
   "power_divider" => 100,
   "station_mode" => "phone",		# station mode
   "tuning_limit_low" => 3000,
   "tuning_limit_high" => 56000000,
   "using_vox" => 0
};

our @channels_60m = ( '5330500', '5346500', '5357000', '5371500', '5403500' );

my $alert_bridge;
my $rig;
my $radios = [ $radio0 ];
my $active_rig = "radio0";
my $muted = 0;
my $digits_local = "";
my $digits_rf = "";
my $digits_local_last = 0;
my $digits_rf_last = 0;
my $tuning_step_long_multiplier = 5;	# long press = step * 5
my $tuning_step_multiplier = 3;	# selected multiplier (defaults to 1khz)
my @tuning_step_multipliers = ( 10, 100, 500, 1000, 2500 );
my $dtmf_long_thres = 300;      # ms to consider a DTMF tone "long" instead of "short" press
my $dtmf_timeout = 10;		# timeout for input of a digit (clear the buffer)
my $dtmf_announce_delay = 10;	# Announce the frequency if no tuning changes for 10 seconds
my $tts_seqno = 0;
my $loop = IO::Async::Loop->new;
my $auto_readback_timer;
my $dtmf_digit_timer;

# bridge name to ID mappings
my $bridge_names;

###############################################
print "remotepi-ari.pl version <unknown>\n";
print "The standard Dangerous Devices warranty applies.\n";
print "-- If it breaks, you get to keep both pieces. If there are more than two pieces, please return them for product improvement!\n";
print "http://github.com/PripyatAutomations/remotepi\n\n";

#################
# Call Handling #
#################

##########
# Hamlib #
##########
sub hamlib_debug_level {
    my $new_lvl = $_[0];

    if ($new_lvl =~ m/none/i) {
      return $Hamlib::RIG_DEBUG_NONE;
    } elsif ($new_lvl =~ m/bug/i) {
      return $Hamlib::RIG_DEBUG_BUG;
    } elsif ($new_lvl =~ m/err/i) {
      return $Hamlib::RIG_DEBUG_ERR;
    } elsif ($new_lvl =~ m/warn/i) {
      return $Hamlib::RIG_DEBUG_WARN;
    } elsif ($new_lvl =~ m/verbose/i) {
      return $Hamlib::RIG_DEBUG_VERBOSE;
    } elsif ($new_lvl =~ m/trace/i) {
      return $Hamlib::RIG_DEBUG_TRACE;
    } elsif ($new_lvl =~ m/cache/i) {
      return $Hamlib::RIG_DEBUG_CACHE;
    } else {
      return $Hamlib::RIG_DEBUG_VERBOSE;
    }
}

sub rig_get_freq {
    my $vfo = $radio0->{'active_vfo'};
    if ($vfo eq $Hamlib::RIG_VFO_A) {
       return $radio0->{'freq_a'} = $rig->get_freq();
    } elsif ($vfo eq $Hamlib::RIG_VFO_B) {
       return $radio0->{'freq_b'} = $rig->get_freq();
    } elsif ($vfo eq $Hamlib::RIG_VFO_C) {
       return $radio0->{'freq_c'} = $rig->get_freq();
    }
}


sub cancel_autoreadback {
    if (defined($auto_readback_timer)) {
       $loop->remove($auto_readback_timer);
       undef($auto_readback_timer);
    }
}

sub rig_set_freq {
    my $freq = $_[0];
    my $chan_id = $_[1];
    my $vfo = $radio0->{'active_vfo'};

    if ($vfo eq $Hamlib::RIG_VFO_A) {
       $rig->set_freq($Hamlib::RIG_VFO_A, $freq);
       $radio0->{'freq_a'} = $freq;
    } elsif ($vfo eq $Hamlib::RIG_VFO_B) {
       $rig->set_freq($Hamlib::RIG_VFO_B, $freq);
       $radio0->{'freq_b'} = $freq;
    } elsif ($vfo eq $Hamlib::RIG_VFO_C) {
       $rig->set_freq($Hamlib::RIG_VFO_C, $freq);
       $radio0->{'freq_c'} = $freq;
    }

#    cancel_autoreadback();	# Cancel last autoreadback timer
#    $auto_readback_timer = IO::Async::Timer::Countdown->new(
#       delay => $dtmf_announce_delay,
#       on_expire => sub {
#          print "[dtmf] Readback timeout ($dtmf_announce_delay)\n";
#          rig_readback_freq($chan_id);
#          rig_readback_mode($chan_id);
#       }
#    );
#    $loop->add(($auto_readback_timer)->start);
}

sub rig_readback_freq {
   my $vfo_freq;
   my $chan_id = $_[0];
   cancel_autoreadback();
   $vfo_freq = rig_get_freq();
   print "[dtmf] * Readback [VFO" . $radio0->{'active_vfo'} . "] freq: " . $vfo_freq/1000 . "\n";
   ari_bridge_add_chan($alert_bridge->{'id'}, $chan_id);
   my $body_args = { "SAY_DATA" => "Frequency " . $vfo_freq/1000 };
   my $tmpchan = ari_originate_tts("readbackfreq", $body_args);
   my $res = ari_bridge_add_chan($alert_bridge->{'id'}, $tmpchan);

   print "rig_readback_freq res: " . Dumper($res) . "\n";
   return $vfo_freq;
}

sub rig_readback_mode {
   #
}

sub rig_refresh() {
   rig_get_freq();
}

# Initialize hamlib interface
print "[hamlib] Initializing hamlib interface to rig $active_rig\n";
Hamlib::rig_set_debug(hamlib_debug_level($radio0->{'debug_level'}));
$radio0->{'hamlib'} = new Hamlib::Rig($radio0->{'model'}) or die("Failed connecting to hamlib\n");
$rig = $radio0->{'hamlib'};
$rig->set_conf("retry", "50");
$rig->open();

my $ptt = $rig->get_ptt($radio0->{'active_vfo'});
if ($ptt) {
   print "[ptt] Clearing $active_rig PTT...\n";
   $rig->set_ptt($radio0->{'active_vfo'}, $Hamlib::RIG_PTT_OFF);
}


print "[hamlib] Backend copyright:\t$rig->{caps}->{copyright}\n";
print "[hamlib] Model:\t\t\t$rig->{caps}->{model_name}\n";
print "[hamlib] Manufacturer:\t\t$rig->{caps}->{mfg_name}\n";
print "[hamlib] Backend version:\t$rig->{caps}->{version}\n";
my $inf = $rig->get_info();
print "[hamlib] Connected Rig:\t\t$inf";


########
# DTMF #
########
sub cancel_dtmf_timeout {
    if (defined($dtmf_digit_timer)) {
       # Free the old timer
       $loop->remove($dtmf_digit_timer);
       if ($debug) {
          print "[dtmf/debug] clearing timeout for active channel.";
       }
       undef($dtmf_digit_timer);
    } else {
       if ($debug) {
          print "[dtmf/debug] clearing timeout (not present).\n";
       }
    }
}

sub dtmf_timeout_update {
    my $chan_id = $_[0];
    my $rfside = $_[1];
    cancel_dtmf_timeout();

    $dtmf_digit_timer = IO::Async::Timer::Countdown->new(
       delay => $dtmf_timeout,
       on_expire => sub {
          print "[dtmf] digit timeout ($dtmf_timeout), clearing " . ($rfside ? "RF" : "VoIP") . " digit buffer for ($chan_id)\n";

          if ($rfside) {
             $digits_rf = '';
          } else {
             $digits_local = '';
          }
       }
    );
    $loop->add(($dtmf_digit_timer)->start);
}

###########################
# Asterisk REST Interface #
###########################
sub ari_bridge_enumerate {
   print "[ari] Enumerating bridges\n";
   my $ari_bridges_json = ari_get("/bridges");
   our $ari_bridges;
   our $bridge;

   if (defined($ari_bridges_json)) {
      $ari_bridges = JSON->new->utf8->decode($ari_bridges_json);
   }

   for $bridge (@$ari_bridges) {
      if (defined($bridge->{'name'}) && defined($bridge->{'id'})) {
         my $brname = $bridge->{'name'};
         my $brid = $bridge->{'id'};

         # if a bridge name is new or is updated
         if (!defined($bridge_names->{$brid}) || !($bridge_names->{$brid} eq $brname)) {
            if ($debug) {
               print "[bridge/debug] caching name $brname => [$brid]\n";
            }

            # Store the name in the array
            $bridge_names->{$brid} = $brname;
         }
      }
   }

   return $ari_bridges;
}

sub ari_bridge_find_or_create {
   my $target_bridge = $_[0];
   our $bridge;
   our $active_bridges = ari_bridge_enumerate();

   for $bridge (@$active_bridges) {
      if ($bridge->{'name'} eq $target_bridge) {
         print "[ari] Selecting bridge " . ari_bridge_str($bridge->{'id'}) . "\n";
         return $bridge;
      }
   }

   if (!defined($bridge)) {
      # Otherwise, create a new bridge
      print "[ari] Creating new bridge: \@$target_bridge\n";
      my $my_bridge = ari_post("/bridges", {"name" => $target_bridge, "type" => "mixing,dtmf_events,proxy_media" });
      return "";
   }
}

sub ari_bridge_add_chan {
   my $bridge = $_[0];
   my $chan_id = $_[1];

   if (!defined($bridge) || !defined($chan_id)) {
      print "[bridge] add_chan missing argument: bridge=" . defined($bridge) . " chan_id=" . defined($chan_id) . "\n";
      return;
   }

   print "[bridge] adding channel $chan_id to bridge " . ari_bridge_str($bridge) . "\n";
   our $res = ari_post("/bridges/$bridge/addChannel", {
      'channel' => $chan_id,
      # Ensure DTMF doesn't get out to the radio
      'absorbDTMF' => 'true',
      'inhibitConnectedLineUpdates' => 'true'
   });
   return $res;
}

sub ari_originate_tts {
  my $endpoint = $_[0];
  my $body_args = $_[1];
  my $chan_id;
  our $res;

  my $query_args = { "endpoint" => "Local/1\@" . $endpoint,
                     "extension" => "1",
                     "context" => $endpoint,
                     "otherChannelId" => "tts-$tts_seqno" };
  $res = ari_post("/channels/create", $query_args, $body_args);
  $tts_seqno++;
  print "res: " . Dumper($res) . "\n";
#  $chan_id = $res->{'channel'}{'id'};
  $chan_id = "tts-$tts_seqno";

  print "\n[tts] originating Local channel (tts-$tts_seqno) for tts: " . Dumper($body_args) . "\n";

  if (!defined($endpoint) || !defined($chan_id)) {
      print "[tts] ari_originate_tts: endpoint=" . defined($endpoint) . " chan_id=" . defined($chan_id) . "\n";
      return;
   }

  print "[tts] originate $endpoint ($chan_id)\n";
  return $chan_id;
}

sub ari_post {
   my $url = "http://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} . $_[0];

   if ($debug) {
      print "[ari/debug] POST $url\n";
   }

   my $ua      = LWP::UserAgent->new(); 
   $ua->timeout(20);
   my $request;

   if (@_ > 1) {
      $request = POST($url, $_[1]);
   } else {
      $request = POST($url);
   }

   $request->authorization_basic($ari->{'user'}, $ari->{'pass'});
   my $res = $ua->request($request, $_[1]);
#   print "Res: " . Dumper($res) . "\n";
   return $res->content;
}

sub ari_get {
   my $url = "http://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} . $_[0];

   if ($debug) {
      print "[ari/debug] GET $url\n";
   }

   my $ua      = LWP::UserAgent->new(); 
   $ua->timeout(20);
   my $request;
   if (@_ > 1) {
      $request = GET($url, $_[1]);
   } else {
      $request = GET($url);
   }

   $request->authorization_basic($ari->{'user'}, $ari->{'pass'});
   my $res = $ua->request($request, $_[1]);
   return $res->content;
}

sub ari_delete {
   my $url = "http://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} . $_[0];

   if ($debug) {
      print "[ari/debug] DELETE $url\n";
   }

   my $ua = LWP::UserAgent->new();
   $ua->timeout(20);
   my $request;
   $request = HTTP::Request->new(DELETE => $url);
   $request->authorization_basic($ari->{'user'}, $ari->{'pass'});
   my $res = $ua->request($request);
   return $res->content;
}

sub ari_bridge_destroy_all() {
   my $target_bridge = $_[0];
   print "[ari] Enumerating bridges\n";
   my $ari_bridges = ari_get("/bridges");
   my $active_bridges = JSON->new->utf8->decode($ari_bridges);

   for our $bridge (@$active_bridges) {
      print "[ari] Killing bridge " . $bridge->{'name'} . " [" . $bridge->{'id'} . "]\n";
      my $url = "/bridge/" . $bridge->{'id'};
      ari_delete($url);
   }
}

sub ari_bridge_str {
   my $bridge_id = $_[0];
   our $out;

   if (!defined($bridge_id)) {
      print "[ari] ari_bridge_str: no bridge-id passed\n";
      return;
   }

   if (!defined($bridge_names->{$bridge_id})) {
      print "[bridge/debug] bridge_str miss for id " . $bridge_id . "\n";
      return "[" . $_[0] . "]";
   }
   $out = '@' . $bridge_names->{$bridge_id} . " [" . $bridge_id . "]";
   return $out;
}

sub ari_play {
   my $chan_id = $_[0];
   my $media = $_[1];
   $tts_seqno++;
   ari_post("/channels/$chan_id/play/$tts_seqno?media=$media");
   
   print "[tts] Playing \"$media\" on $chan_id ($tts_seqno)\n";
   return $tts_seqno;
}

sub play_beep {
   my $chan_id = $_[0];

   return ari_play($chan_id, "sound:beep");
}

sub start_baresip_channel {
   my $chan_name = $_[0];
   my $dialstring = $radio0->{'dialstring'};

   print "[audio] starting baresip for channel $chan_name with dialstring \"$dialstring\"\n";
   my $file = "/opt/remotepi/logs/baresip-$chan_name.log";
   open my $fh, '>', $file;
   defined(my $pid = fork) or die "fork: $!";
   if (!$pid) {
      open STDOUT, '>&', $fh;
      exec("baresip", ("baresip", "-f", "/opt/remotepi/etc/baresip-$active_rig", "-e", "$dialstring", "-d"));
   }
   waitpid $pid, 0;
   my $retcode = $?;
   print "* baresip-$chan_name running as pid $pid with status $retcode\n";
}

sub station_modeset {
   my $new_mode = $_[0];

   $radio0->{'station_mode'} = $new_mode;

   if ($new_mode eq "phone") {
      print "[station] Switching to PHONE mode\n";
      system("/opt/remotepi/bin/modeset-phone");
      start_baresip_channel($active_rig);
   } elsif ($new_mode eq "digi") {
      print "[station] Switching to DIGI mode\n";
      system("/opt/remotepi/bin/modeset-digi");
   } elsif ($new_mode eq "winlink") {
      print "[station] Switching to WINLINK mode\n";
      system("/opt/remotepi/bin/modeset-winlink");
   }
}

##################
# WebSocket Crud #
##################
print "[ari] Initializing ARI connection\n";

my $ari_conn = Net::Async::WebSocket::Client->new(
   on_text_frame => sub {
      my ( $self, $frame ) = @_;
      our $rdata = decode_json($frame) or die("Failed parsing JSON");

      my $digit = $rdata->{'digit'};
      my $duration = $rdata->{'duration_ms'};
      my $chan_name = $rdata->{'channel'}{'name'};
      my $chan_id = $rdata->{'channel'}{'id'};
      my $chan_state = $rdata->{'channel'}{'state'};
      my $rfside = 0;
      my $rdigits;

      if (defined($rdata->{'channel'}) && defined($rdata->{'channel'}{'dialplan'}) &&
          defined($rdata->{'channel'}{'dialplan'}{'context'}) && $rdata->{'channel'}{'dialplan'}{'context'} =~ m/^radio(\d+)$/) {
         $rfside = 1;
      }

      if (defined($rdata->{'channel'}) && defined($rdata->{'channel'}{'caller'}) &&
          defined($rdata->{'channel'}{'caller'}{'number'}) && $rdata->{'channel'}{'caller'}{'number'} =~ m/^radio(\d+)$/) {
         $rfside = 1;
      }

      if ($rdata->{'type'} =~ m/^ApplicationReplaced$/i) {
         # Do things, if necessary (not yet)
      } elsif ($rdata->{'type'} =~ m/^ChannelDtmfReceived$/i) {
         dtmf_timeout_update($chan_id, $rfside);
         if ($rfside) {
            if ($debug) {
               print "[dtmf/debug] Got Digit: $digit ($duration) from $chan_name ($chan_id)$\n";
            }
            $digits_rf = $digits_rf . $digit;
         } else {
            if ($debug) {
               print "[dtmf/debug] Got Digit: $digit ($duration) from $chan_name ($chan_id)\n";
            }

            # Parse single digit things
            if ($digits_local eq "") {
               $digits_local = $digit;
            } else {
               $digits_local = $digits_local . $digit;
            }
         }

         if ($digit eq '*') {
            cancel_dtmf_timeout();
            if ($rfside) {
               if ($duration >= 1000) {
                  $digits_rf = '';
                  print "[dtmf] Clearing DTMF read from RF\n";
               }
            } else {
               if ($duration >= 1000) {
                  $digits_local = '';
                  print "[dtmf] Clearing DTMF read from VoIP\n";
                  play_beep($chan_id);
               } elsif ($digits_local eq '***') {
                  my $curr_blocked = $radio0->{'ptt_blocked'};
                  my $blocked;

                  if ($curr_blocked) {
                     $blocked = 0;
                  } else {
                     $blocked = 1;
                  }

                  print "[ptt] Toggling PTT blocked status on $active_rig to: " . ($blocked ? "true" : "false") . "\n";
                  $radio0->{'ptt_blocked'} = $blocked;
                  $digits_local = '';
               }
            }
         } elsif ($digit =~ m/^(\d+)$/) {
            cancel_dtmf_timeout();
            if (!($rfside)) {
               if ($digits_local eq $digit) {
                  rig_get_freq();
                  # do the things
                  if ($digit eq 1) {
                     my $newfreq;
                     if ($duration <= $dtmf_long_thres) {
                        $newfreq = rig_get_freq() + ($tuning_step_multipliers[$tuning_step_multiplier]);
                        print "[dtmf] Tuning UP (short) to " . $newfreq/1000 . "\n";
                     } elsif ($duration >= $dtmf_long_thres) {
                        $newfreq = rig_get_freq() + ($tuning_step_multipliers[$tuning_step_multiplier] * $tuning_step_long_multiplier);
                        print "[dtmf] Tuning UP (long) to " . $newfreq/1000 . "\n";
                     }
                     rig_set_freq($newfreq, $chan_id);
                  } elsif ($digit eq 4) {
                     my $newfreq;
                     if ($duration <= $dtmf_long_thres) {
                        $newfreq = rig_get_freq() - ($tuning_step_multipliers[$tuning_step_multiplier]);
                        print "[dtmf] Tuning DOWN (short) to " . $newfreq/1000 . "\n";
                     } elsif ($duration >= $dtmf_long_thres) {
                        $newfreq = rig_get_freq() - ($tuning_step_multipliers[$tuning_step_multiplier] * $tuning_step_long_multiplier);
                        print "[dtmf] Tuning DOWN (long) to " . $newfreq/1000 . "\n";
                     }
                     rig_set_freq($newfreq, $chan_id);
                  } elsif ($digit eq 2) {
                     if ($duration <= $dtmf_long_thres) {
                        print "[dtmf] * RF gain UP (quick)\n";
                     } elsif ($duration >= $dtmf_long_thres) {
                       print "[dtmf] * RF gain UP (long)\n";
                     }
                  } elsif ($digit eq 5) {
                    if ($duration <= $dtmf_long_thres) {
                       print "[dtmf] * RF gain DOWN (quick)\n";
                    } elsif ($duration >= $dtmf_long_thres) {
                       print "[dtmf] * RF gain DOWN (long)\n";
                    }
                  } elsif ($digit eq 3) {
                     if ($duration <= $dtmf_long_thres) {
                        print "[dtmf] * Mic gain UP (quick)\n";
                     } elsif ($duration >= $dtmf_long_thres) {
                        print "[dtmf] * Mic gain UP (long)\n";
                     }
                  } elsif ($digit eq 6) {
                    if ($duration <= $dtmf_long_thres) {
                       print "[dtmf] * Mic gain DOWN (quick)\n";
                    } elsif ($duration >= $dtmf_long_thres) {
                       print "[dtmf] * Mic gain DOWN (long)\n";
                    }
                  } elsif ($digit eq 9) {
                    my $sz = @tuning_step_multipliers;

                    if (($tuning_step_multiplier) >= ($sz - 1)) {
                       # wrap around
                       $tuning_step_multiplier = 0;
                    } else {
                       $tuning_step_multiplier++;
                    }
                    print "[dtmf] Set tuning step to " . $tuning_step_multipliers[$tuning_step_multiplier] . " (" . $tuning_step_multiplier . ")\n";
                  }
                 
                  $digits_local = '';
               }
            }
         } elsif ($digit eq '#') {
            cancel_dtmf_timeout();
            if ($rfside) {
               $rdigits = $digits_rf;
               $digits_rf = '';
               print "[dtmf] Read: $rdigits from RF $chan_name ($chan_id)\n";
            } else {
               $rdigits = $digits_local;
               $digits_local = '';
               print "[dtmf] Read: $rdigits from VoIP $chan_name ($chan_id)\n";

               if ($rdigits eq '#') {
                  if ($radio0->{'using_vox'}) {
                     if ($muted) {
                        $muted = 0;
                        print "[dtmf] MUTE off\n";
                     } else {
                        $muted = 1;
                        print "[dtmf] MUTE on\n";
                     }
                  } else {	# not VOX, toggle PTT
                    if ($radio0->{'ptt_active'}) {
                       $rig->set_ptt($radio0->{'active_vfo'}, $Hamlib::RIG_PTT_OFF);
                       $radio0->{'ptt_active'} = 0;
                       print "[dtmf] radio0 PTT OFF\n";
                    } else {
                       if (!($radio0->{'ptt_blocked'})) {
                          $rig->set_ptt($radio0->{'active_vfo'}, $Hamlib::RIG_PTT_ON_DATA);
                          $radio0->{'ptt_active'} = 1;
                          print "[dtmf] radio0 PTT ON\n";
                       } else {
                          print "[ptt] PTT for $active_rig is blocked, igoring PTT ON request\n";
                          ari_play($chan_id, "sound:beeperr")
                       }
                    }
                  }
               }
            }

            # Parse the command:
            if ($rdigits =~ m/^\*0(\d+)/) {
               my $new_mode;
               if ($1 == 0) {
                  $new_mode = "phone";
               } elsif ($1 == 1) {
                  $new_mode = "digi";
               } elsif ($1 == 2) {
                  $new_mode = "winlink";
               } else {
                  $new_mode = "INVALID";
               }
               $radio0->{'station_mode'} = $new_mode;
               print "[dtmf] Set Station Mode: $new_mode ($1)\n";
               station_modeset($new_mode);
            } elsif ($rdigits =~ m/^\*0#/) {
               print "[dtmf] Readback mode: " . $radio0->{'station_mode'} . "\n";
            } elsif ($rdigits =~ m/^\*1(\d+)#/) {
               print "[dtmf] Set VOX: $1\n";
               $rig->set_level($radio0->{'active_vfo'}, "VOX", int($1));
            } elsif ($rdigits =~ m/^\*1#/) {
               my $vox_level = $rig->get_level_i($radio0->{'active_vfo'}, "VOX");
               print "[dtmf] * Readback VOX setting: $vox_level\n";
            } elsif ($rdigits =~ m/^\*2#/) {
               my $rf_gain = $rig->get_level_i($Hamlib::RIG_LEVEL_RF);
               print "[dtmf] * Readback RF gain: $rf_gain\n";
            } elsif ($rdigits =~ m/^\*2(\d+)#/) {
               print "[dtmf] Set RF gain: $1\n";
               $rig->set_level($Hamlib::RIG_LEVEL_RF, int($1));
            } elsif ($rdigits =~ m/^\*3(\d+)#/) {
               my $my_freq;

               # is it 6 or less digits? If so, it's khz not hertz
               if (length($1) <= 6) {
                  $my_freq = int($1) * 1000;
               } else {
                  $my_freq = $1;
               }
               print "[dtmf] Set Freq: $my_freq\n";
               rig_set_freq($my_freq, $chan_id);
            } elsif ($rdigits =~ m/^\*3#/) {
               my $vfo_freq = rig_readback_freq($chan_id);
            } elsif ($rdigits =~ m/\*4(\*)?(\d+)#/) {
               my $r_sign = $1;
               my $r_val = $2;
               my $ifshift;

               if (defined($r_sign)) {
                  $ifshift = -$r_val;
               } else {
                  $ifshift = $r_val;
               }
               print "[dtmf] * Set IF-Shift: $1\n";
            } elsif ($rdigits =~ m/^\*4#/) {
               my $if_shift = $radio0->{'if_shift'};
               print "[dtmf] * Readback IF shift: $if_shift\n";
#               system("rigctl"
            } elsif ($rdigits =~ m/^\*5#/) {
               my $tx_power = $rig->get_level_i($Hamlib::RIG_LEVEL_RFPOWER) * $radio0->{'power_divider'};
               print "[dtmf] * Readback TX power: $tx_power Watt(s)\n";
            } elsif ($rdigits =~ m/^\*5(\d+)#/) {
               my $hamlib_power = int($1) / $radio0->{'power_divider'};
               print "[dtmf] Set TX Power: $1 Watt(s) ($hamlib_power)\n";
               $rig->set_level($Hamlib::RIG_LEVEL_RFPOWER, $hamlib_power);
            } elsif ($rdigits =~ m/^\*6(\d+)#/) {
               my $modmode = $Hamlib::RIG_MODE_LSB;

               if ($1 eq 0) { 		# LSB
                  $modmode = $Hamlib::RIG_MODE_LSB;
                  print "[dtmf] Set Modulation Mode: LSB\n";
               } elsif ($1 eq 1) { 	# USB
                  $modmode = $Hamlib::RIG_MODE_USB;
                  print "[dtmf] Set Modulation Mode: USB\n";
               } elsif ($1 eq 2) {	# FM
                  $modmode = $Hamlib::RIG_MODE_FM;
                  print "[dtmf] Set Modulation Mode: FM\n";
               } elsif ($1 eq 3) {	# AM
                  $modmode = $Hamlib::RIG_MODE_AM;
                  print "[dtmf] Set Modulation Mode: AM\n";
               } elsif ($1 eq 4) {	# DATA-U
                  print "[dtmf] Set Modulation Mode: DATA-U unsupported yet\n";
                  return;
               } else {
                  print "[dtmf] Set Modulation Mode: invalid value $1\n";
                  return;
               }
               $rig->set_mode($modmode);
            } elsif ($rdigits =~ m/^\*6#/) {
               my ($mode, $width) = $rig->get_mode();
               print "[dtmf] Readback mode: ".Hamlib::rig_strrmode($mode)." $width\n";
            } elsif ($rdigits =~ m/^\*7(\d+)#/) {
               print "[dtmf] * Set DSP level: $1\n";
            } elsif ($rdigits =~ m/^\*8(\d+)#/) {
               print "[dtmf] * Set Notch Filter: $1\n";
            } elsif ($rdigits =~ m/^\*9(\d+)#/) {
               my $old_step = $tuning_step_multiplier;
               my $sz = @tuning_step_multipliers;
               if (int($1) <= ($sz - 1)) {	# valid selection
                  $tuning_step_multiplier = int($1);
               } else {
                  # invalid selection, cry at user
                  print "[dtmf] Invalid tuning step selection $1, ignoring request\n"
               }
               print "[dtmf] Set Tuning Step: " . $tuning_step_multipliers[$tuning_step_multiplier] . " ($1)\n";
            } elsif ($rdigits =~ m/^\*9#/) {
               print "[dtmf] Readback tuning step: " . $tuning_step_multipliers[$tuning_step_multiplier] . " (" . $tuning_step_multiplier . ")\n";
            }
         } elsif ($rfside && $digits_rf =~ m/^8675309$/) {
            print "*** SELCALL " . int(rig_get_freq()) . "***\n";
            # XXX: Call Paging extension and try to bridge into conference
         }
         
         if ($rfside) {
            $digits_rf_last = time();
         } else {
            $digits_local_last = time();
         }
      } elsif ($rdata->{'type'} =~ m/^StasisStart$/i) {
         print "[ari] New client: [] $chan_name ($chan_id) ($chan_state)\n";

         if (defined($rdata->{'channel'}) && defined($rdata->{'channel'}{'state'}) &&
             $rdata->{'channel'}{'state'} =~ m/^ring/i) {
             print "[chan] channel $chan_name ($chan_id) is in ringing state, Answering.\n";
             ari_post("/channels/$chan_id/answer");
         }
         
         print "[bridge] joining client $chan_name ($chan_id) to bridge " . ari_bridge_str($radio0->{'bridge_id'}) . "\n";

         if ($debug) {
             print "[ari/debug] \$chan_id: $chan_id bridge: " . $radio0->{'bridge_id'} . "\n";
         }

         my $res = ari_bridge_add_chan($radio0->{'bridge_id'}, $chan_id);
      } elsif ($rdata->{'type'} =~ m/^StasisEnd$/i) {
         # NoOp
      } elsif ($rdata->{'type'} =~ m/^ChannelDestroyed$/i) {
         print "[chan] Channel Destroyed $chan_name ($chan_id)\n";
      } elsif ($rdata->{'type'} =~ m/^ChannelEnteredBridge$/i) {
         print "[bridge] Client $chan_name ($chan_id) joined bridge " . ari_bridge_str($radio0->{'bridge_id'}) . "\n";
      } elsif ($rdata->{'type'} =~ m/^ChannelHangupRequest$/i) {
         print "[chan] Disconnect by client: $chan_name ($chan_id)\n";
      } elsif ($rdata->{'type'} =~ m/^ChannelLeftBridge$/i) {
         print "[bridge] Channel $chan_name ($chan_id) left bridge: " . ari_bridge_str($radio0->{'bridge_id'}) . "\n";
      } elsif ($rdata->{'type'} =~ m/^ChannelStateChange$/i) {
         if ($debug) {
            print "[ari/debug] ChannelStateChange:\n";
#            print Dumper($rdata) . "\n";
         }
      } elsif ($rdata->{'type'} =~ m/^ChannelVarset$/i) {
         if ($debug) {
#            print "[ari/debug] ChannelVarset: " . Dumper($rdata) . "\n";
         }
         print "[bridge] ChannelVarset event\n";
      } elsif ($rdata->{'type'} =~ m/^PlaybackStarted$/i) {
         if ($debug) {
            print "[sound] PlaybackStarted on " . $rdata->{'playback'}{'target_uri'} . ": " .
                  $rdata->{'playback'}{'media_uri'} . "\n";
         }
      } elsif ($rdata->{'type'} =~ m/^PlaybackFinished$/i) {
         my @spl_chan_id = split(':', $rdata->{'playback'}{'target_uri'});
         $chan_id = $spl_chan_id[1];
         
         if ($debug) {
            print "[sound] PlaybackFinished on " . $rdata->{'playback'}{'target_uri'} . ": " .
                  $rdata->{'playback'}{'media_uri'} . "\n";
         }
         ari_bridge_add_chan($radio0->{'bridge_id'}, $chan_id);
      } else {
         print "[ari/debug] Got unknown Event Type: " . $rdata->{'type'} . "\n";
#         print Dumper($rdata) . "\n";
      }
   },
);

##############
# Event Loop #
##############
$loop->add($ari_conn);

$ari_conn->connect(
   on_connected => sub {
      print "[ari] Asterisk REST Interface connected!\n";
      my $bridge = ari_bridge_find_or_create($active_rig);

      # set default operating mode
      if (defined($station->{'default_mode'}) && !($station->{'default_mode'} eq "")) {
         my $mode = $station->{'default_mode'};
         print "[station] Switching to default mode ($mode) as configured\n";
         station_modeset($mode);
      }

      rig_refresh();

      # try again? it seems asterisk doesn't return the ID sometimes when creating the bridge?
      if ($bridge eq "") {
         $bridge = ari_bridge_find_or_create($active_rig);
      }

      $radio0->{'bridge_id'} = $bridge->{'id'};
      $alert_bridge = ari_bridge_find_or_create("alert");

      # try again? it seems asterisk doesn't return the ID sometimes when creating the bridge?
      if ($alert_bridge eq "") {
         $alert_bridge = ari_bridge_find_or_create("alert");
      }
      print "[alert] Activated alert bridge: " . $alert_bridge->{'id'} . "\n";
   },
   url => "ws://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} .
          "/events?api_key=" . $ari->{'user'} . ":" . $ari->{'pass'} . "&app=$app_name"
)->then(sub {
#   $ari->send_text_frame( "Hello, world!\n" );
})->get;

$loop->run;

#$rig->close();
