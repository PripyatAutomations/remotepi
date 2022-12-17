<?php
  include('config.inc.php');
  require_once('CiscoIPPhone/Framework.php');

  if (isset($_REQUEST['ctrl'])) {
     $ctrl = $_REQUEST['ctrl'];
  } else {
     die('Invalid control');
  }

  header('Content-type: text/xml');

  if (!isset($_REQUEST['val'])) { // Display input field
     if ($ctrl == "freq") {
        $cur_val = rig_get_freq($rig);
        $ctrl_label = "Frequency";
        $obj = new CiscoIPPhoneInput;
        $obj->addItem($ctrl_label, 'val', $cur_val, 'N');
     } else if ($ctrl == "power") {
        $cur_val = rig_get_power($rig);
        $ctrl_label = "TX Power";
        $obj = new CiscoIPPhoneInput;
        $obj->addItem($ctrl_label, 'val', $cur_val, 'N');
     } else if ($ctrl == "tunestep") {
        $cur_val = rig_get_tuning_step($rig);
        $ctrl_label = "Tuning Step";
        $obj = new CiscoIPPhoneMenu;
     } else if ($ctrl == "modmode") {
        $cur_val = rig_get_modulation_mode($rig);
        $ctrl_label = "Mod. Mode";
        $obj = new CiscoIPPhoneMenu;
     } else if ($ctrl == "stamode") {
        $cur_val = rig_get_station_mode($rig);
        $ctrl_label = "Station Mode";
        $obj = new CiscoIPPhoneMenu;
        $act = "";
        $obj->addItem('LSB (Lower Sideband)$act', $urlbase . "/cisco/rig-set.php?name=$cisco_name&rig=$rig&ctrl=$ctrl&val=lsb");
        $obj->addItem('USB (Upper Sideband)$act', $urlbase . "/cisco/rig-set.php?name=$cisco_name&rig=$rig&ctrl=$ctrl&val=usb");
        $obj->addItem('FM (Frequency Mod)$act', $urlbase . "/cisco/rig-set.php?name=$cisco_name&rig=$rig&ctrl=$ctrl&val=fm");
        $obj->addItem('AM (Amplitude Mod)$act', $urlbase . "/cisco/rig-set.php?name=$cisco_name&rig=$rig&ctrl=$ctrl&val=am");
     }

     $obj->setTitle("$rig:$ctrl");
     $obj->setPrompt('Change the setting...');
     $obj->setURL($urlbase . "/rig-set.php?rig=$rig&ctrl=$ctrl");
     echo $obj->toXML();
  } else { // Handle form submission
     $val = $_REQUEST['val'];
     # Validate
     # Submit to flrig / rigctld
     # Send a confirmation response
     $obj = new CiscoIPPhoneText;
     $obj->setTitle($rig . ":" . $ctrl);
     $obj->setPrompt('Changes succesful!');
     $obj->setText("Changes succesful!\nSet $rig:$ctrl => $val");
     echo $obj->toXML();
  }
?>
