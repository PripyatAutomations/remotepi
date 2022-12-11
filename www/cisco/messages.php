<?php
  include('config.inc.php');
header('Content-Type: text/xml');
header('Connection: close');
?>
<CiscoIPPhoneIconFileMenu>
 <title>Messages</title>
 <Prompt>Chose a mailbox</Prompt>
 <MenuItem>
  <IconIndex>0</IconIndex>
  <Name>Winlink</Name>
  <URL>http://10.11.0.3/cisco/msg-winlink.php</URL>
 </MenuItem>
 <IconItem>
  <Index>0</Index>
  <URL>http://10.11.0.3/cisco/img/ico-winlink.png</URL>
 </IconItem>
 <MenuItem>
  <IconIndex>1</IconIndex>
  <Name>Local Email</Name>
  <URL>http://10.11.0.3/cisco/msg-email.php</URL>
 </MenuItem>
 <IconItem>
  <Index>1</Index>
  <URL>http://10.11.0.3/cisco/img/ico-email.png</URL>
 </IconItem>
 <MenuItem>
  <IconIndex>2</IconIndex>
  <Name>SMSes</Name>
  <URL>http://10.11.0.3/cisco/msg-sms.php</URL>
 </MenuItem>
 <IconItem>
  <Index>2</Index>
  <URL>http://10.11.0.3/cisco/img/ico-email.png</URL>
 </IconItem>
</CiscoIPPhoneIconFileMenu>
