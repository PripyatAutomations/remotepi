<?php
  include('config.inc.php');
header('Content-Type: text/xml');
header('Connection: close');

if (isset($_REQUEST['rig'])) {
   $rig = $_REQUEST['rig'];
} else {
   $rig = "rig0";
}

$menu_level = "Main";
?>
<CiscoIPPhoneMenu>
 <Title><?= $rig . " " . $menu_level; ?> Menu</Title>
 <Prompt>Chose an option above...</Prompt>
 <MenuItem>
  <Name>VOX mode</Name>
  <URL>http://10.11.0.3/cisco/rig-vox-menu.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>RF Gain</Name>
  <URL>http://10.11.0.3/cisco/rig-gain-menu.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>Frequency</Name>
  <URL>http://10.11.0.3/cisco/rig-freq-menu.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>IF Shift</Name>
  <URL>http://10.11.0.3/cisco/rig-ifshift-menu.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>Power Output</Name>
  <URL>http://10.11.0.3/cisco/rig-rfpower-menu.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>Modulation Mode</Name>
  <URL>http://10.11.0.3/cisco/rig-modmode.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>DSP Noise Reduction</Name>
  <URL>http://10.11.0.3/cisco/rig-dnr.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>Notch Filter</Name>
  <URL>http://10.11.0.3/cisco/rig-notch.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>Tuning Step</Name>
  <URL>http://10.11.0.3/cisco/rig-tuningstep-menu.php</URL>
 </MenuItem>
 <MenuItem>
  <Name>Station Mode</Name>
  <URL>http://10.11.0.3/cisco/rig-stationmode.php</URL>
 </MenuItem>
</CiscoIPPhoneMenu>
