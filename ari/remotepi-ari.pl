#!/usr/bin/perl
######
use strict;
use warnings;
use HTTP::Request::Common;
use IO::Async::Loop;
use IO::Async::Timer::Countdown;
use IO::Async::Stream;
use IO::Handle;
use Net::Async::WebSocket::Client;
use JSON;
use Data::Dumper;
use Hamlib;
use POSIX qw(strftime);
use RPC::XML qw(:types);
use RPC::XML::Client;
use LWP;
require LWP::UserAgent;
#use Term::Readline;
use Time::HiRes qw(gettimeofday tv_interval usleep);

# ARI crud needs moved out to here...
#use Asterisk::ARI;

# disable linebuffering on output, so we can log easier
STDOUT->autoflush(1);

####XXX: Move to config file####
my $app_name = "remotepi";
my $VERSION = "20221203.01";

# Log levels for messages
my $LOG_NOISE = 7;		# extra noisy debugging
my $LOG_DEBUG = 6;		# normal debugging
my $LOG_INFO = 5;		# informational messages (noisy)
my $LOG_WARN = 4;		# warnings
my $LOG_AUDIT = 3;		# auditing events
my $LOG_BUG = 2;		# bugs
my $LOG_FATAL = 1;		# fatal errors

# default debug level
#my $debug_level = $LOG_INFO;
my $debug_level = $LOG_WARN;

my $ari = {
   "host" => "127.0.0.1",
   "port" => 8088,
   "prefix" => "/pbx/ari",
   "user" => "remotepi",
   "pass" => "remotepi"
};

my $flrig = {
   "url" => "http://localhost:12345/RPC2"
};

my $station = {
   "callsign" => "N0CALL",
   "default_mode" => "",
#   "default_mode" => "phone",
   "gridsquare" => "FN19",
   "selcall_dtmf" => "987654321",
   "shutdown_dtmf" => "##90210352##"
};

my $new_user = {
   "name" => "",		# name of the user
   "chan_regex" => "",		# regex to match the channel
   "pin" => "",			# 4-6 digit pin # for ham menu
};

my $client = {
   "chan_id" => "",
   "chan_name" => "",
   "current_bridge" => "",
   "permissions" => "*",		# * for all, admin,listen,speak
   "username" => "guest",
   "tts_voice" => "en_in_Kajal"
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
my $dtmf_long_thres = 220;      # ms to consider a DTMF tone "long" instead of "short" press
my $dtmf_timeout = 10;		# timeout for input of a digit (clear the buffer)
my $dtmf_announce_delay = 3;	# Announce the frequency if no tuning changes for 10 seconds
my $tts_seqno = 0;
my $loop = IO::Async::Loop->new;
my $auto_readback_timer;
my $dtmf_digit_timer;
our $history = $ENV{'HOME'} . "/.remotepi-ari.$active_rig.history";

# bridge name to ID mappings
my $bridge_names;

###############################################
print "remotepi-ari.pl version <$VERSION>\n";
print "The standard Dangerous Devices warranty applies.\n";
print "-- If it breaks, you get to keep both pieces. If there are more than two pieces, please return them for product improvement!\n";
print "http://github.com/PripyatAutomations/remotepi\n\n";

#############
# Utilities #
#############
sub Log {
#   # Capture the log_type and level from arguments
   my $log_type = shift;
   my $log_level = shift;

   if ($debug_level < $log_level) {
      return 0;
   }

   my $datestamp = strftime("%Y/%m/%d %M:%H:%S", localtime);
   my $lvl;

   if ($log_level == $LOG_NOISE) {
      $lvl = "noise";
   } elsif ($log_level == $LOG_DEBUG) {
      $lvl = "debug";
   } elsif ($log_level == $LOG_INFO) {
      $lvl = "info";
   } elsif ($log_level == $LOG_WARN) {
      $lvl = "warn";
   } elsif ($log_level == $LOG_BUG) {
      $lvl = "BUG";
   } elsif ($log_level == $LOG_FATAL) {
      $lvl = "FATAL";
   } else {
      $lvl = "UNKNOWN";
   }
   print $datestamp . " [$log_type/$lvl]";

   foreach my $a(@_) {
      print " " . $a;
   }
   print "\n";
}

sub shutdown() {
   $rig->close();
}

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
   } else {
     Log "dtmf", $LOG_DEBUG, "no arb timer - skipping";
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

   cancel_autoreadback();	# Cancel last autoreadback timer
   $auto_readback_timer = IO::Async::Timer::Countdown->new(
      delay => $dtmf_announce_delay,
      on_expire => sub {
         Log "dtmf", $LOG_INFO, "Readback timeout ($dtmf_announce_delay)";
         rig_readback_freq($chan_id);
         rig_readback_mode($chan_id);
      }
   );
   $loop->add(($auto_readback_timer)->start);
}

sub rig_readback_freq {
   my $vfo_freq;
#   my $ab = $alert_bridge->{'id'};
   my $chan_id = $_[0];
   my $ab = $chan_id;

   # clear the timer
   cancel_autoreadback();

   $vfo_freq = rig_get_freq();
   Log "dtmf", $LOG_DEBUG, "Readback [VFO" . $radio0->{'active_vfo'} . "] freq: " . $vfo_freq/1000;
   ari_speech($ab, "frequency");
   ari_play($ab, "digits:" . int(($vfo_freq/1000)));
   ari_speech($ab, "kilohertz");
   ari_playback_done($ab);

   return $vfo_freq;
}

sub rig_readback_mode {
   my $chan_id = $_[0];

   my ($mode, $width) = $rig->get_mode();
   my $new_mode = Hamlib::rig_strrmode($mode);
   Log "dtmf", $LOG_INFO, "Readback mode: $new_mode $width";

   if ($new_mode =~ m/^pkt/i) {
      $new_mode = 'data';
   }

   ari_speech($chan_id, lc($new_mode));
   ari_play("number:$width");
   ari_playback_done($chan_id);
}

sub rig_refresh() {
   rig_get_freq();
}

# Initialize hamlib interface
Log "hamlib", $LOG_INFO, "Initializing hamlib interface to rig $active_rig";
Hamlib::rig_set_debug(hamlib_debug_level($radio0->{'debug_level'}));
$radio0->{'hamlib'} = new Hamlib::Rig($radio0->{'model'}) or die("Failed connecting to hamlib\n");
$rig = $radio0->{'hamlib'};
$rig->set_conf("retry", "50");
$rig->open();

my $ptt = $rig->get_ptt($radio0->{'active_vfo'});
if ($ptt) {
   Log "ptt", $LOG_BUG, "Clearing $active_rig PTT...";
   $rig->set_ptt($radio0->{'active_vfo'}, $Hamlib::RIG_PTT_OFF);
}

$radio0->{'hamlib_riginfo'} = $rig->get_info();
Log "hamlib", $LOG_INFO, "Backend copyright:\t$rig->{caps}->{copyright}";
Log "hamlib", $LOG_INFO, "Model:\t\t$rig->{caps}->{model_name}";
Log "hamlib", $LOG_INFO, "Manufacturer:\t\t$rig->{caps}->{mfg_name}";
Log "hamlib", $LOG_INFO, "Backend version:\t$rig->{caps}->{version}";
Log "hamlib", $LOG_INFO, "Connected Rig:\t" . $radio0->{'hamlib_riginfo'};

########
# DTMF #
########
sub cancel_dtmf_timeout {
   if (defined($dtmf_digit_timer)) {
      # Free the old timer
      $loop->remove($dtmf_digit_timer);
      Log "dtmf", $LOG_DEBUG, "clearing timeout for active channel.";
      undef($dtmf_digit_timer);
   } else {
      Log "dtmf", $LOG_DEBUG, "clearing timeout (not present).";
   }
}

sub dtmf_timeout_update {
   my $chan_id = $_[0];
   my $rfside = $_[1];
   cancel_dtmf_timeout();

   $dtmf_digit_timer = IO::Async::Timer::Countdown->new(
      delay => $dtmf_timeout,
      on_expire => sub {
         Log "dtmf", $LOG_INFO, "digit timeout ($dtmf_timeout), clearing " . ($rfside ? "RF" : "VoIP") . " digit buffer for ($chan_id)";

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
   Log "ari", $LOG_INFO, "Enumerating bridges";
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
            Log "bridge", $LOG_DEBUG, "caching name $brname => [$brid]";

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
         Log "ari", $LOG_INFO, "Selecting bridge " . ari_bridge_str($bridge->{'id'});
         return $bridge;
      }
   }

   if (!defined($bridge)) {
      Log "ari", $LOG_INFO, "Creating new bridge: \@$target_bridge";
      my $my_bridge = ari_post("/bridges", {"name" => $target_bridge, "type" => "mixing,dtmf_events,proxy_media" });
      return "";
   }
}

sub ari_bridge_add_chan {
   my $bridge = $_[0];
   my $chan_id = $_[1];

   if (!defined($bridge) || !defined($chan_id)) {
      Log "bridge", $LOG_BUG, "add_chan missing argument: bridge=" . defined($bridge) . " chan_id=" . defined($chan_id);
      return;
   }

   Log "bridge", $LOG_INFO, "adding channel $chan_id to bridge " . ari_bridge_str($bridge);
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
   Log "tts", $LOG_DEBUG, "originate_tts: res: " . Dumper($res) . "\n";
 #  $chan_id = $res->{'channel'}{'id'};
   $chan_id = "tts-$tts_seqno";

   Log "tts", $LOG_INFO, "originating Local channel (tts-$tts_seqno) for tts: " . Dumper($body_args);

   if (!defined($endpoint) || !defined($chan_id)) {
      Log"tts", $LOG_INFO, "ari_originate_tts: endpoint=" . defined($endpoint) . " chan_id=" . defined($chan_id);
      return;
   }

   Log "tts", $LOG_INFO, "originate $endpoint ($chan_id)";
   return $chan_id;
}

sub ari_post {
   my $url = "http://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} . $_[0];

   Log "ari", $LOG_DEBUG, "POST $url";

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
   Log "ari", $LOG_DEBUG, "post Res: " . Dumper($res) . "\n";
   return $res->content;
}

sub ari_get {
   my $url = "http://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} . $_[0];

   Log "ari", $LOG_DEBUG, "GET $url";

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

   Log "ari", $LOG_DEBUG, "DELETE $url";

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
   Log "ari", $LOG_INFO, "Enumerating bridges";
   my $ari_bridges = ari_get("/bridges");
   my $active_bridges = JSON->new->utf8->decode($ari_bridges);

   for our $bridge (@$active_bridges) {
      Log "ari", $LOG_INFO, "Killing bridge " . $bridge->{'name'} . " [" . $bridge->{'id'} . "]";
      my $url = "/bridge/" . $bridge->{'id'};
      ari_delete($url);
   }
}

sub ari_bridge_str {
   my $bridge_id = $_[0];
   our $out;

   if (!defined($bridge_id)) {
      Log "ari", $LOG_BUG, "ari_bridge_str: no bridge-id passed";
      return;
   }

   if (!defined($bridge_names->{$bridge_id})) {
      Log "bridge", $LOG_DEBUG, "bridge_str miss for id " . $bridge_id;
      return "[" . $_[0] . "]";
   }
   $out = '@' . $bridge_names->{$bridge_id} . " [" . $bridge_id . "]";
   return $out;
}

sub ari_play {
   my $chan_id = $_[0];
   my $media = $_[1];

   $tts_seqno++;
#   ari_bridge_add_chan($alert_bridge->{'id'}, $chan_id);
   ari_post("/channels/$chan_id/play/$tts_seqno?media=$media");
   
   Log "tts", $LOG_DEBUG, "Playing \"$media\" on $chan_id ($tts_seqno)";
   return $tts_seqno;
}

sub ari_speech {
   my $chan_id = $_[0];
   my $prompt = $_[1];
   ari_play($chan_id, "sound:remotepi/" . $client->{'tts_voice'} . "/" . $prompt);
}

sub ari_speak_number {
   # Figure out unit
   # Figure out scale
   # Make it human-presentable
   # Read off the number, digit by digit
   # Read off the suffix (scale+unit, ie: kilohertz)
}

sub play_beep {
   my $chan_id = $_[0];

   return ari_play($chan_id, "sound:beep");
}

sub start_baresip_channel {
   my $chan_name = $_[0];
   my $dialstring = $radio0->{'dialstring'};

   Log "audio", $LOG_INFO, "starting baresip for channel $chan_name with dialstring \"$dialstring\"";
   my $file = "/opt/remotepi/logs/baresip-$chan_name.log";
   open my $fh, '>', $file;
   defined(my $pid = fork) or die "fork: $!";
   if (!$pid) {
      open STDOUT, '>&', $fh;
      exec("baresip", ("baresip", "-f", "/opt/remotepi/etc/baresip-$active_rig", "-e", "$dialstring", "-d"));
   }
   waitpid $pid, 0;
   my $retcode = $?;
   Log "audio", $LOG_INFO, "baresip-$chan_name running as pid $pid with status $retcode";
}

sub station_modeset {
   my $new_mode = $_[0];

   $radio0->{'station_mode'} = $new_mode;

   if ($new_mode eq "phone") {
      Log "station", $LOG_AUDIT, "Switching to PHONE mode";
      system("/opt/remotepi/bin/modeset-off");
      system("/opt/remotepi/genconf/baresip-ua");
      start_baresip_channel($active_rig);
   } elsif ($new_mode eq "digi") {
      Log "station", $LOG_AUDIT, "Switching to DIGI mode";
      system("/opt/remotepi/bin/modeset-digi");
   } elsif ($new_mode eq "winlink") {
      Log "station", $LOG_AUDIT, "Switching to WINLINK mode";
      system("/opt/remotepi/bin/modeset-winlink");
   }
}

# Call this when the playback is finished, so that it can be sent back to main bridge
sub ari_playback_done {
   my $rdata = $_[0];
   my $chan_name = $rdata->{'channel'}{'name'};
   my $chan_id = $rdata->{'channel'}{'id'};
   my $chan_state = $rdata->{'channel'}{'state'};
#   ari_bridge_add_chan($radio0->{'bridge_id'}, $chan_id);
}

sub stop_all_sounds {
   my $chan_id = $_[0];
}

########
# DTMF #
########
sub parse_ari {
   my $rdata = $_[0];
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
      # Halt all playing sounds (to be less annoying)
      stop_all_sounds($chan_id);

      dtmf_timeout_update($chan_id, $rfside);
      if ($rfside) {
         Log "dtmf", $LOG_DEBUG, "Got Digit: $digit ($duration) from $chan_name ($chan_id)";
         $digits_rf = $digits_rf . $digit;
      } else {
         Log "dtmf", $LOG_DEBUG, "Got Digit: $digit ($duration) from $chan_name ($chan_id)";

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
               Log "dtmf", $LOG_DEBUG, "Clearing DTMF buffer (RF)";
               play_beep($chan_id);
            }
         } else {
            if ($duration >= 1000) {
               $digits_local = '';
               Log "dtmf", $LOG_DEBUG, "Clearing DTMF buffer (VoIP)";
               play_beep($chan_id);
            } elsif ($digits_local eq '***') {
               my $curr_blocked = $radio0->{'ptt_blocked'};
               my $blocked;

               if ($curr_blocked) {
                  $blocked = 0;
               } else {
                  $blocked = 1;
               }

               Log "ptt", $LOG_AUDIT, "Toggling PTT blocked status on $active_rig to: " . ($blocked ? "true" : "false");

               if ($blocked) {
                  ari_speech($chan_id, "ptt_blocked");
               } else {
                  ari_speech($chan_id, "ptt_unblocked");
               }
               ari_playback_done($rdata);

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
                  if ($duration < $dtmf_long_thres) {
                     $newfreq = rig_get_freq() + ($tuning_step_multipliers[$tuning_step_multiplier]);
                     Log "dtmf", $LOG_AUDIT, "Tuning UP (short) to " . $newfreq/1000;
                  } elsif ($duration >= $dtmf_long_thres) {
                     $newfreq = rig_get_freq() + ($tuning_step_multipliers[$tuning_step_multiplier] * $tuning_step_long_multiplier);
                     Log "dtmf", $LOG_AUDIT, "Tuning UP (long) to " . $newfreq/1000;
                  }

                  # This will set a timeout to readback frequency
                  rig_set_freq($newfreq, $chan_id);
               } elsif ($digit eq 4) {
                  my $newfreq;
                  if ($duration < $dtmf_long_thres) {
                     $newfreq = rig_get_freq() - ($tuning_step_multipliers[$tuning_step_multiplier]);
                     Log "dtmf", $LOG_AUDIT, "Tuning DOWN (short) to " . $newfreq/1000;
                  } elsif ($duration >= $dtmf_long_thres) {
                     $newfreq = rig_get_freq() - ($tuning_step_multipliers[$tuning_step_multiplier] * $tuning_step_long_multiplier);
                     Log "dtmf", $LOG_AUDIT, "Tuning DOWN (long) to " . $newfreq/1000;
                  }

                  # This will set a timeout to readback frequency
                  rig_set_freq($newfreq, $chan_id);
               } elsif ($digit eq 2) {
                  if ($duration <= $dtmf_long_thres) {
                     Log "dtmf", $LOG_BUG, "NYI: gain UP (quick)";
                  } elsif ($duration >= $dtmf_long_thres) {
                     Log "dtmf", $LOG_BUG, "NYI: RF gain UP (long)";
                  }
               } elsif ($digit eq 5) {
                 if ($duration <= $dtmf_long_thres) {
                    Log "dtmf", $LOG_BUG, "NYI RF gain DOWN (quick)";
                 } elsif ($duration >= $dtmf_long_thres) {
                    Log "dtmf", $LOG_BUG, "NYI RF gain DOWN (long)";
                 }
               } elsif ($digit eq 3) {
                  if ($duration <= $dtmf_long_thres) {
                     Log "dtmf", $LOG_BUG, "NYI Mic gain UP (quick)";
                  } elsif ($duration >= $dtmf_long_thres) {
                     Log "dtmf", $LOG_BUG, "NYI Mic gain UP (long)";
                  }
               } elsif ($digit eq 6) {
                 if ($duration <= $dtmf_long_thres) {
                    Log "dtmf", $LOG_BUG, "NYI Mic gain DOWN (quick)";
                 } elsif ($duration >= $dtmf_long_thres) {
                    Log "dtmf", $LOG_BUG, "NYI Mic gain DOWN (long)";
                 }
               } elsif ($digit eq 9) {
                 my $sz = @tuning_step_multipliers;

                 if (($tuning_step_multiplier) >= ($sz - 1)) {
                    # wrap around
                    $tuning_step_multiplier = 0;
                 } else {
                    $tuning_step_multiplier++;
                 }
                 Log "dtmf", $LOG_AUDIT, "Set tuning step to " . $tuning_step_multipliers[$tuning_step_multiplier] . " (" . $tuning_step_multiplier . ")";
                 ari_speech($chan_id, "tuning_step");
                 ari_play($chan_id, "number:" . $tuning_step_multipliers[$tuning_step_multiplier]);
                 ari_speech($chan_id, "hertz");
                 ari_playback_done($rdata);
               }
              
               $digits_local = '';
            } else {
               if ($rfside) {
                  $rdigits = $digits_rf;
               } else {
                  $rdigits = $digits_local;
               }

               Log "test", $LOG_BUG, "rdigits: $rdigits";
               if ($rdigits =~ m/^\*6$/) {
                  Log "test", $LOG_BUG, "helpmenu";
                  ari_speech($chan_id, "help_mode");
                  ari_playback_done($rdata);
                  Log "test", $LOG_BUG, "helpmenu done";
               }
            }
         }
      } elsif ($digit eq '#') {
         cancel_dtmf_timeout();
         if ($rfside) {
            $rdigits = $digits_rf;
            $digits_rf = '';
            Log "dtmf", $LOG_BUG, "Read: $rdigits from RF $chan_name ($chan_id)";
         } else {
            $rdigits = $digits_local;
            $digits_local = '';
            Log "dtmf", $LOG_DEBUG, "Read: $rdigits from VoIP $chan_name ($chan_id)";

            if ($rdigits eq '#') {
               if ($radio0->{'using_vox'}) {
                  if ($muted) {
                     $muted = 0;
                     Log "dtmf", $LOG_AUDIT, "$active_rig MUTE off";
                     ari_speech($chan_id, "mute_off");
                  } else {
                     $muted = 1;
                     Log "dtmf", $LOG_AUDIT, "$active_rig MUTE on";
                     ari_speech($chan_id, "mute_on");
                  }
               } else {	# not VOX, toggle PTT
                 if ($radio0->{'ptt_active'}) {
                    $rig->set_ptt($radio0->{'active_vfo'}, $Hamlib::RIG_PTT_OFF);
                    $radio0->{'ptt_active'} = 0;
                    Log "dtmf", $LOG_AUDIT, "$active_rig PTT OFF";
                    ari_play($chan_id, "beep");
                 } else {
                    if (!($radio0->{'ptt_blocked'})) {
                       $rig->set_ptt($radio0->{'active_vfo'}, $Hamlib::RIG_PTT_ON_DATA);
                       $radio0->{'ptt_active'} = 1;
                       Log "dtmf", $LOG_AUDIT, "$active_rig PTT ON";
                       ari_play($chan_id, "beep");
                    } else {
                       Log "ptt", $LOG_AUDIT, "PTT for $active_rig is blocked, igoring PTT ON request";
                       ari_speech($chan_id, "ptt_is_blocked")
                    }
                 }
               }
               ari_playback_done($rdata);
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
            Log "dtmf", $LOG_AUDIT, "Set Station Mode: $new_mode ($1)";
            station_modeset($new_mode);

            if ($radio0->{'station_mode'} =~ m/^phone$/i) {
               ari_speech($chan_id, "sta_mode_phone");
            } elsif ($radio0->{'station_mode'} =~ m/^digi$/i) {
               ari_speech($chan_id, "sta_mode_digi");
            } elsif ($radio0->{'station_mode'} =~ m/^winlink$/i) {
               ari_speech($chan_id, "sta_mode_winlink");
            }
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*0#/) {
            Log "dtmf", $LOG_INFO, "Readback mode: " . $radio0->{'station_mode'};

            if ($radio0->{'station_mode'} =~ m/^phone$/i) {
               ari_speech($chan_id, "sta_mode_phone");
            } elsif ($radio0->{'station_mode'} =~ m/^digi$/i) {
               ari_speech($chan_id, "sta_mode_digi");
            } elsif ($radio0->{'station_mode'} =~ m/^winlink$/i) {
               ari_speech($chan_id, "sta_mode_winlink");
            }
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*1(\d+)#/) {
            Log "dtmf", $LOG_BUG, "NYI Set VOX: $1";
#            $rig->set_level($radio0->{'active_vfo'}, "VOX", int($1));
            ari_play($chan_id, "sound:beeperr");
         } elsif ($rdigits =~ m/^\*1#/) {
            my $vox_level = 0;
#            $vox_level = $rig->get_level_i($radio0->{'active_vfo'}, "VOX");
            Log "dtmf", $LOG_BUG, "NYI: Readback VOX setting: $vox_level";
            ari_play($chan_id, "sound:beeperr");
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*2#/) {
            my $rf_gain = $rig->get_level_i($Hamlib::RIG_LEVEL_RF);
            Log "dtmf", $LOG_BUG, "Readback RF gain: $rf_gain";
            ari_play($chan_id, "sound:beeperr");
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*2(\d+)#/) {
            Log "dtmf", $LOG_BUG, "Set RF gain: $1";
            $rig->set_level($Hamlib::RIG_LEVEL_RF, int($1));
            ari_play($chan_id, "sound:beeperr");
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*3(\d+)#/) {
            my $my_freq;

            # is it 6 or less digits? If so, it's khz not hertz
            if (length($1) <= 6) {
               $my_freq = int($1) * 1000;
            } else {
               $my_freq = $1;
            }
            Log "dtmf", $LOG_INFO, "Set Freq: $my_freq";
            rig_set_freq($my_freq, $chan_id);
         } elsif ($rdigits =~ m/^\*3#/) {
            rig_readback_freq($chan_id);
         } elsif ($rdigits =~ m/\*4(\*)?(\d+)#/) {
            my $r_sign = $1;
            my $r_val = $2;
            my $ifshift;

            if (defined($r_sign)) {
               $ifshift = -$r_val;
            } else {
               $ifshift = $r_val;
            }
            Log "dtmf", $LOG_BUG, "NYI Set IF-Shift: $1";
            ari_play($chan_id, "sound:beeperr");
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*4#/) {
            my $if_shift = $radio0->{'if_shift'};
            Log "dtmf", $LOG_BUG, "NYI Readback IF shift: $if_shift";
            ari_play($chan_id, "sound:beeperr");
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*5#/) {
            my $tx_power = $rig->get_level_i($Hamlib::RIG_LEVEL_RFPOWER) * $radio0->{'power_divider'};
            Log "dtmf", $LOG_BUG, "NYI Readback TX power: $tx_power Watt(s)";
#            rig_readback_output_power($chan_id);
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*5(\d+)#/) {
            my $hamlib_power = int($1) / $radio0->{'power_divider'};
            Log "dtmf", $LOG_AUDIT, "Set TX Power: $1 Watt(s) ($hamlib_power)";
            $rig->set_level($Hamlib::RIG_LEVEL_RFPOWER, $hamlib_power);
#            rig_readback_output_power($chan_id);
            ari_speech($chan_id, "output_power");
            ari_play($chan_id, "digits:" . int($1));
            ari_speech($chan_id, "watts");
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*6(\d+)#/) {
            my $modmode = $Hamlib::RIG_MODE_LSB;

            if ($1 eq 0) { 		# LSB
               $modmode = $Hamlib::RIG_MODE_LSB;
               Log "dtmf", $LOG_AUDIT, "Set Modulation Mode: LSB";
               ari_speech($chan_id, "modulation_mode");
               ari_speech($chan_id, "lsb");
            } elsif ($1 eq 1) { 	# USB
               $modmode = $Hamlib::RIG_MODE_USB;
               Log "dtmf", $LOG_AUDIT, "Set Modulation Mode: USB";
               ari_speech($chan_id, "modulation_mode");
               ari_speech($chan_id, "usb");
            } elsif ($1 eq 2) {	# FM
               $modmode = $Hamlib::RIG_MODE_FM;
               Log "dtmf", $LOG_AUDIT, "Set Modulation Mode: FM";
               ari_speech($chan_id, "modulation_mode");
               ari_speech($chan_id, "fm");
            } elsif ($1 eq 3) {	# AM
               $modmode = $Hamlib::RIG_MODE_AM;
               Log "dtmf", $LOG_AUDIT, "Set Modulation Mode: AM";
               ari_speech($chan_id, "modulation_mode");
               ari_speech($chan_id, "am");
            } elsif ($1 eq 4) {	# DATA-U
               Log "dtmf", $LOG_AUDIT, "Set Modulation Mode: DATA-U unsupported yet";
               ari_speech($chan_id, "modulation_mode");
               ari_speech($chan_id, "data");
               return;
            } else {
               Log "dtmf", $LOG_AUDIT, "Set Modulation Mode: invalid value $1";
               ari_play($chan_id, "sound:beeperr");
               ari_speech($chan_id, "help_mode");
               return;
            }
            ari_playback_done($rdata);
            $rig->set_mode($modmode);
            rig_readback_mode($chan_id);
         } elsif ($rdigits =~ m/^\*6#/) {
            rig_readback_mode($chan_id);
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*7(\d+)#/) {
            Log "dtmf", $LOG_BUG, "NYI Set DSP level: $1";
            ari_play($chan_id, "sound:beeperr");
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*8(\d+)#/) {
            Log "dtmf", $LOG_BUG, "NYI Set Notch Filter: $1";
            ari_play($chan_id, "sound:beeperr");
            ari_playback_done($rdata);
         } elsif ($rdigits =~ m/^\*9(\d+)#/) {
            my $old_step = $tuning_step_multiplier;
            my $sz = @tuning_step_multipliers;
            if (int($1) <= ($sz - 1)) {	# valid selection
               $tuning_step_multiplier = int($1);
            } else {
               # invalid selection, cry at user
               Log "dtmf", $LOG_INFO, "Invalid tuning step selection $1, ignoring request";
               ari_play($chan_id, "sound:beeperr");
            }
            Log "dtmf", $LOG_AUDIT, "Set Tuning Step: " . $tuning_step_multipliers[$tuning_step_multiplier] . " ($1)";
            ari_speech($chan_id, "tuning_step");
            ari_play($chan_id, "number:" . $tuning_step_multipliers[$tuning_step_multiplier]);
            ari_speech($chan_id, "hertz");
         } elsif ($rdigits =~ m/^\*9#/) {
            Log "dtmf", $LOG_INFO, "Readback tuning step: " . $tuning_step_multipliers[$tuning_step_multiplier] . " (" . $tuning_step_multiplier . ")";
            ari_speech($chan_id, "tuning_step");
            ari_play($chan_id, "number:" . $tuning_step_multipliers[$tuning_step_multiplier]);
            ari_speech($chan_id, "hertz");
         }
         ari_playback_done($rdata);
      } elsif ($rfside && $digits_rf =~ m/^8675309$/) {
         Log "selcall", $LOG_AUDIT, "*** SELCALL " . int(rig_get_freq()) . "***";
         # XXX: Call Paging extension and try to bridge into conference
      }
      
      if ($rfside) {
         $digits_rf_last = time();
      } else {
         $digits_local_last = time();
      }
   } elsif ($rdata->{'type'} =~ m/^StasisStart$/i) {
      Log "ari", $LOG_INFO, "New client: $chan_name ($chan_id) ($chan_state)";

      if (defined($rdata->{'channel'}) && defined($rdata->{'channel'}{'state'}) &&
          $rdata->{'channel'}{'state'} =~ m/^ring/i) {
          Log "chan", $LOG_INFO, "channel $chan_name ($chan_id) is in ringing state, Answering.";
          ari_post("/channels/$chan_id/answer");
      }
      my $res = ari_bridge_add_chan($radio0->{'bridge_id'}, $chan_id);
      ari_speech($chan_id, "main_menu");
      ari_playback_done($rdata);
   } elsif ($rdata->{'type'} =~ m/^StasisEnd$/i) {
      # NoOp
   } elsif ($rdata->{'type'} =~ m/^ChannelConnectedLine$/) {
      Log "chan", $LOG_INFO, "Channel $chan_name ($chan_id) connected to bridge " . ari_bridge_str($radio0->{'bridge_id'});
   } elsif ($rdata->{'type'} =~ m/^ChannelDestroyed$/) {
      Log "chan", $LOG_INFO, "Channel $chan_name ($chan_id) destroyed";
   } elsif ($rdata->{'type'} =~ m/^ChannelEnteredBridge$/) {
      Log "bridge", $LOG_INFO, "Client $chan_name ($chan_id) joined bridge " . ari_bridge_str($radio0->{'bridge_id'});
   } elsif ($rdata->{'type'} =~ m/^ChannelHangupRequest$/) {
      Log "chan", $LOG_INFO, "Disconnect by client: $chan_name ($chan_id)";
   } elsif ($rdata->{'type'} =~ m/^ChannelLeftBridge$/) {
      Log "bridge", $LOG_INFO, "Channel $chan_name ($chan_id) left bridge: " . ari_bridge_str($radio0->{'bridge_id'});
   } elsif ($rdata->{'type'} =~ m/^ChannelStateChange$/) {
      Log "ari", $LOG_DEBUG, "ChannelStateChange: " . Dumper($rdata);
   } elsif ($rdata->{'type'} =~ m/^ChannelVarset$/) {
      Log "ari", $LOG_DEBUG, "ChannelVarset: " . Dumper($rdata);
   } elsif ($rdata->{'type'} =~ m/^PlaybackStarted$/) {
      Log "sound", $LOG_DEBUG, "PlaybackStarted on " . $rdata->{'playback'}{'target_uri'} . ": " .
           $rdata->{'playback'}{'media_uri'};
   } elsif ($rdata->{'type'} =~ m/^PlaybackFinished$/) {
      my @spl_chan_id = split(':', $rdata->{'playback'}{'target_uri'});
      $chan_id = $spl_chan_id[1];
      
      Log "sound", $LOG_DEBUG, "PlaybackFinished on " . $rdata->{'playback'}{'target_uri'} . ": " .
           $rdata->{'playback'}{'media_uri'};
#      ari_playback_done($rdata);
   } else {
      Log "ari", $LOG_BUG, "Got unknown Event Type: " . $rdata->{'type'} . ":" . Dumper($rdata);
   }
}

##################
# WebSocket Crud #
##################
Log "ari", $LOG_INFO, "Initializing ARI connection";

my $ari_conn = Net::Async::WebSocket::Client->new(
   on_text_frame => sub {
      my ( $self, $frame ) = @_;
      our $rdata = decode_json($frame) or die("Failed parsing JSON");
      parse_ari($rdata);
   },
   on_read_eof => sub {
      Log "ari", $LOG_FATAL, "ARI connection got EOF";
      exit(1);
   },
   on_read_error => sub {
      Log "ari", $LOG_FATAL, "Error reading ARI connection";
      exit(2);
   },
   on_write_error => sub {
      Log "ari", $LOG_FATAL, "Error writing ARI connection";
      exit(3);
   },
);

#################
# Local Console #
#################
sub cons_parse_cmd {
   my $user = shift;
   my $verb = shift;

   ###########
   # Bridges #
   ###########
   if ($verb =~ m/^bridge/i) {
   ############
   # Channels #
   ############
   } elsif ($verb =~ m/^chan/i) {
   #########
   # Users #
   #########
   } elsif ($verb =~ m/^user/i) {
   }
}

##############
# Event Loop #
##############
$loop->add($ari_conn);

$ari_conn->connect(
   on_connect_error => sub {
      Log "ari", $LOG_FATAL, "Error connecting to Asterisk";
   },
   on_resolve_error => sub {
      Log "ari", $LOG_FATAL, "Error resolving";
   },
   on_send_error => sub {
      Log "ari", $LOG_FATAL, "Error sending on ARI connection";
   },
   on_connected => sub {
      Log "ari", $LOG_INFO, "Asterisk REST Interface connected!";
      my $bridge = ari_bridge_find_or_create($active_rig);

      # set default operating mode
      if (defined($station->{'default_mode'}) && !($station->{'default_mode'} eq "")) {
         my $mode = $station->{'default_mode'};
         Log "station", $LOG_INFO, "Switching to default mode ($mode) as configured";
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
      Log "alert", $LOG_INFO, "Activated alert bridge: " . $alert_bridge->{'id'};

      # XXX: Enumerate already existing radio channels and join them into the bridge, if appropriate
   },
   url => "ws://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} .
          "/events?api_key=" . $ari->{'user'} . ":" . $ari->{'pass'} . "&app=$app_name"
)->then(sub {
#   $ari->send_text_frame( "Hello, world!\n" );
})->get;

$loop->run;
