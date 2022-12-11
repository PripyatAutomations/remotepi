<?php
  include('config.inc.php');
  header("Content-type: text/xml");
?>
<CiscoIPPhoneMenu>
 <Title>Radio Selection</Title>
 <Prompt>Select a radio to operate...</Prompt>
<MenuItem>
  <Name>radio0 (Yaesu FT-891)</Name>
  <URL>http://10.11.0.3/cisco/rig-menu.php?rig=radio0</URL>
</MenuItem>
<MenuItem>
  <Name>Main Menu</Name>
  <URL>http://10.11.0.3/cisco/services.php</URL>
</MenuItem>
</CiscoIPPhoneMenu>
