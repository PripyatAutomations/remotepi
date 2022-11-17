#!/usr/bin/perl
#use strict;
use warnings;
use HTTP::Request::Common;
use IO::Async::Loop;
use Net::Async::WebSocket::Client;
use JSON;
use Data::Dumper;
require LWP::UserAgent;

####XXX: Move to config file####
my $app_name = "remotepi";

my $ari = {
   "host" => "127.0.0.1",
   "port" => 8088,
   "prefix" => "/pbx/ari",
   "user" => "remotepi",
   "pass" => "remotepi"
};

###########################
# Asterisk REST Interface #
###########################
sub ari_bridge_destroy_all() {
   my $target_bridge = $_[0];
   print "* Enumerating existing bridges\n";
   my $ari_bridges = ari_get("/bridges");
   my $active_bridges = JSON->new->utf8->decode($ari_bridges);

   for our $bridge (@$active_bridges) {
      print "* Killing bridge " . $bridge->{'name'} . " [" . $bridge->{'id'} . "]\n";
      my $url = "/bridge/" . $bridge->{'id'};
      ari_delete($url);
   }
}

sub ari_post {
   my $url = "http://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} . $_[0];
#   print "** POST $url ***\n";

   my $ua      = LWP::UserAgent->new(); 
   $ua->timeout(20);
   my $request;
   if (@_ > 1) {
      $request = POST($url, $_[1]);
   } else {
      $request = POST($url);
   }

   $request->authorization_basic($ari->{'user'}, $ari->{'pass'});
#   print "\tReq: " . Dumper($_[0]) . " | Args: " . Dumper($my_args) . "|\n";
   my $res = $ua->request($request, $_[1]);
#   print "POST response: " . $res->content . "\n";
   return $res->content;
}

sub ari_get {
   my $url = "http://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} . $_[0];
#   print "** GET $url ***\n";

   my $ua      = LWP::UserAgent->new(); 
   $ua->timeout(20);
   my $request;
   if (@_ > 1) {
      $request = GET($url, $_[1]);
   } else {
      $request = GET($url);
   }

   $request->authorization_basic($ari->{'user'}, $ari->{'pass'});
#   print "\tReq: " . Dumper($_[0]) . " | Args: " . Dumper($my_args) . "|\n";
   my $res = $ua->request($request, $_[1]);
#   print "GET response: " . $res->content . "\n";
   return $res->content;
}

sub ari_delete {
   my $url = "http://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} . $_[0];
   my $ua = LWP::UserAgent->new();
   $ua->timeout(20);
   my $request;
   $request = HTTP::Request->new(DELETE => $url);
   $request->authorization_basic($ari->{'user'}, $ari->{'pass'});
   my $res = $ua->request($request);
   return $res->content;
}

##################
# WebSocket Crud #
##################
print "* Initializing ARI connection\n";

my $ari_conn = Net::Async::WebSocket::Client->new(
   on_text_frame => sub {
      my ( $self, $frame ) = @_;
      our $rdata = decode_json($frame) or die("Failed parsing JSON");

      my $digit = $rdata->{'digit'};
      my $duration = $rdata->{'duration_ms'};
      my $chan_name = $rdata->{'channel'}{'name'};
      my $chan_id = $rdata->{'channel'}{'id'};
      my $rfside = 0;

      if ($rdata->{'channel'}{'caller'}{'number'} =~ m/^radio(\d+)$/) {
         $rfside = 1;
      }
      print Dumper($rdata) . "\n";
   }
);

##############
# Event Loop #
##############
my $loop = IO::Async::Loop->new;
$loop->add($ari_conn);

$ari_conn->connect(
   on_connected => sub {
      #
      print "* Asterisk ARI connected!\n";
      my $bridge = ari_bridge_destroy_all(); 
   },
   url => "ws://" . $ari->{'host'} . ":" . $ari->{'port'} . $ari->{'prefix'} .
          "/events?api_key=" . $ari->{'user'} . ":" . $ari->{'pass'} . "&app=" . $app_name
)->then(sub {
#   $ari->send_text_frame( "Hello, world!\n" );
})->get;

$loop->run;
