<?php
  include('config.inc.php');
  require_once('CiscoIPPhone/Framework.php');

  header('Content-type: text/xml');
  $obj = new CiscoIPPhoneDirectory;
  $obj->setTitle("Skynet Directory");
  $obj->setPrompt('Select a phone...');

  // Add the phone entries (these always exist)
  $obj->addEntry("Joe", "300");
  $obj->addEntry("House7", "200");
  $obj->addEntry("House5", "201");
  $obj->addEntry("NickHouse", "202");
  $obj->addEntry("LeeHouse", "203");
  $obj->addEntry("ZackHouse", "204");
  $obj->addEntry("Conference all", "999");
  $obj->addEntry("Ham Radio", "5000");
  echo $obj->toXML();
?>
