<?php
   include('config.inc.php');
   header('Content-Type: text/xml');
   header('Connection: close');
?>
<CiscoIPPhoneInput>
 <Title><?= $rig . " (" . $cur_freq . ")"; ?></Title>
 <Prompt>Input desired Frequency</Prompt>
 <URL><?= $urlbase; ?>/rig-freq-set.php</URL>
 <InputItem>
  <DisplayName>Frequency</DisplayName>
  <QueryStringParam>freq</QueryStringParam>
  <DefaultValue><?= $cur_freq; ?></DefaultValue>
  <InputFlags>N</InputFlags>
 </InputItem>
</CiscoIPPhoneInput>
