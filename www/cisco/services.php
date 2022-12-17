<?php
  include('config.inc.php');
  require_once('CiscoIPPhone/Framework.php');

  header('Content-type: text/xml');
  $obj = new CiscoIPPhoneMenu;
  $obj->setTitle('Main Menu');
  $obj->setPrompt('Choose a service...');
  $obj->addItem('Remote Radios', $urlbase . '/rig-choser.php?name=' . $cisco_name);
  $obj->addItem('Fortune', $urlbase . '/fortune.php');
  $obj->addItem('Weather', $urlbase . '/wx.php?name=' . $cisco_name);
  echo $obj->toXML();
?>
