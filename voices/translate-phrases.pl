#!/usr/bin/perl
use warnings;
use strict;
use XML::LibXML;
use Data::Dumper;
use JSON;
my $prefix = "/opt/remotepi/voices/langs";

if (!defined($ARGV[0]) || !defined($ARGV[1])) {
   print "Usage: translate-phrases.pl <inputlang> <outputlang> where both are 2 letter codes\n";
   exit(1);
}

my $inlang = lc($ARGV[0]);
my $outlang = lc($ARGV[1]);

if (-f "$prefix/$outlang/on.ssml") {
   print "***************************\n";
   print "* Output directory exists *\n";
   print "***************************\n";
   print "\n";
   print "output langs/$outlang already exists...\n";
   print "Delete it and try again!\n";
   exit(2);
} else {
   mkdir "$prefix/$outlang";
}

if (! -d "$prefix/$inlang/") {
   print "********************************\n";
   print "* Input language doesn't exist *\n";
   print "********************************\n";
   print "\n";
   print "input langs/$inlang doesn't exist...\n";
   print "Create it or check your commandline and try again!\n";
   exit(3);
}

print "* Translating $inlang => $outlang\n";

# Walk the directory, non-recursively...
opendir(DH, "$prefix/$inlang/");
my @templates = readdir(DH);
closedir(DH);

# Loop on .ssml files
foreach my $template (@templates) {
   # Skip dot files
   if ($template =~ /^\./) {
      next;
   }

   if (!($template =~ m/.ssml$/)) {
      print "* skipping $template, not SSML source\n";
      next;
   }

   if (-f "$prefix/$outlang/$template") {
      print "*** Template $outlang/$template already exists, skipping\n";
      # XXX: read y/n and act here
      next;
   }
   print "=> $inlang/$template => $outlang/$template\n";

   # 
   my $xml = "$prefix/$inlang/$template";
   my $dom = XML::LibXML->load_xml(location => $xml);
   my $in_text = "";
   foreach my $key ($dom->findnodes('/speak')) {
      $in_text = $key;

      # quote quotes...
#      $in_text =~ s/"/\\"/g;
   }

   my $translate_args = "--output json --source-language-code=$inlang --target-language-code=$outlang --text='$in_text'";
   my $translate_cmd = "aws translate translate-text $translate_args";
   my $translated = qx($translate_cmd);

   # unquote quotes
#   $translated =~ s/\\"/"/g;
   my $json = decode_json($translated);
   my $translated_text = $json->{'TranslatedText'};

   # open output file
   open(FH, '>:utf8', "$prefix/$outlang/$template");
   # put text
   print FH "$translated_text\n";

   # close output file
   close(FH);
}
