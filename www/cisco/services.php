<?php
  include('config.inc.php');
  header("Content-type: text/xml");
?>
<CiscoIPPhoneMenu>
 <Title>Main Menu</Title>
 <Prompt>Choose a service...</Prompt>
<MenuItem>
  <Name>Remote Radios</Name>
  <URL>http://10.11.0.3/cisco/rig-choser.php</URL>
</MenuItem>
<MenuItem>
  <Name>Fortune</Name>
  <URL>http://10.11.0.3/cisco/fortune.php</URL>
</MenuItem>
</CiscoIPPhoneMenu>
