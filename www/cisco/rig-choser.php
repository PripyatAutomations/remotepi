<?php
  include('config.inc.php');
  require_once('CiscoIPPhone/Framework.php');

  header('Content-type: text/xml');
  $obj = new CiscoIPPhoneMenu;
  $obj->setTitle('Radio Selection');
  $obj->setPrompt('Choose a radio...');
  $obj->addItem('radio0: FT-891', $urlbase . '/rig-menu.php?name=' . $cisco_name . '&rig=radio0');
  $obj->addItem('radio1: TK-790H', $urlbase . '/rig-menu.php?name=' . $cisco_name . '&rig=radio1');
  echo $obj->toXML();
?>
