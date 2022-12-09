#!/usr/bin/perl
# Here we provide a command line (scriptable) interface to remotepi-ari.pl
#
# This lets us control the remote station from scripts as well as DTMF controls
use warnings;
use strict;
use Data::Dumper;

sub do_login { }
sub do_logout { }
sub do_bridge_destroy { }
sub do_bridge_show { }
sub do_channel_destroy { }
sub do_channel_show { }
sub do_radio_create { }
sub do_radio_edit { }
sub do_radio_destroy { }
sub do_radio_show { }
sub do_user_create { }
sub do_user_destroy { }
sub do_user_edit { }
sub do_user_show { }

my $socket = '/opt/remotepi/run/ari.sock';

sub parse_cmd {
    my $cmd = shift;
    my $args = @_;

    print "cmd: $cmd => args: " . Dumper($args) . "\n";
    if ($cmd =~ m/^login/i) {
    } elsif ($cmd =~ m/^logout$/i) {
    } elsif ($cmd =~ m/^bridge destroy/i) {
    } elsif ($cmd =~ m/^bridge show/i) {
    } elsif ($cmd =~ m/^channel destroy/i) {
    } elsif ($cmd =~ m/^channel show/i) {
    } elsif ($cmd =~ m/^radio create/i) {
    } elsif ($cmd =~ m/^radio edit/i) {
    } elsif ($cmd =~ m/^radio destroy/i) {
    } elsif ($cmd =~ m/^radio show/i) {
    } elsif ($cmd =~ m/^user create/i) {
    } elsif ($cmd =~ m/^user destroy/i) {
    } elsif ($cmd =~ m/^user edit/i) {
    } elsif ($cmd =~ m/^user show/i) {
    }
}

parse_cmd("login", "k8sel", "tacocat85");

