<?php
  include('config.inc.php');
  require_once('CiscoIPPhone/Framework.php');

  header('Content-type: text/xml');
  $obj = new CiscoIPPhoneMenu;
  $obj->setTitle($rig . " Main Menu");
  $obj->setPrompt('Choose an option...');
  $obj->addItem('Frequency: ' . rig_get_freq($rig), $urlbase . '/rig-set.php?name=' . $cisco_name . '&rig=' . $rig . '&ctrl=freq');
  $obj->addItem('TX Power: ' . rig_get_power($rig), $urlbase . '/rig-set.php?name=' . $cisco_name . '&rig=' . $rig . '&ctrl=power');
  $obj->addItem('Mod Mode: ' . rig_get_modulation_mode($rig), $urlbase . '/rig-set.php?name=' . $cisco_name . '&rig=' . $rig . '&ctrl=modmode');
  $obj->addItem('Tuning Step: ' . rig_get_tuning_step($rig), $urlbase . '/rig-set.php?name=' . $cisco_name . '&rig=' . $rig . '&ctrl=tunestep');
  $obj->addItem('Station Mode: ' . rig_get_station_mode($rig), $urlbase . '/rig-set.php?name=' . $cisco_name . '&rig=' . $rig . '&ctrl=stamode');
  echo $obj->toXML();
?>
