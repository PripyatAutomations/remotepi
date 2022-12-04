#!/usr/bin/perl -w
# Find and report a list of languages for which we can translate to AND speak the translated texts
use strict;
use warnings;
#use JSON;
use JSON::XS 'decode_json';
use Data::Dumper;

my $prefix = "/opt/remotepi/voices";
my $aws_lang_file = "$prefix/aws-languages.json";
my $aws_voice_file = "$prefix/aws-voices.json";

# Download if needed
if (!-f $aws_lang_file) {
   system("$prefix/update-data.sh");
}

if (! -f $aws_voice_file) {
   system("$prefix/update-data.sh");
}

my $aws_langs_json;
{
   local $/ = undef;
   open(my $fh,  "<", $aws_lang_file) or die("Can't open $aws_lang_file\n");
   $aws_langs_json = <$fh>;
   close $fh;
}

my $aws_voices_json;
{
   local $/ = undef;
   open(my $fh,  "<", $aws_voice_file) or die("Can't open $aws_voice_file\n");
   $aws_voices_json = <$fh>;
   close $fh;
}

my $aws_langs = decode_json($aws_langs_json);
my $aws_voice = decode_json($aws_voices_json);
my $aws_languages = $aws_langs->{'Languages'};
my $aws_voices = $aws_voice->{'Voices'};

print "D: " . Dumper($aws_languages) . "\n";
print "D: " . Dumper($aws_voices) . "\n";
