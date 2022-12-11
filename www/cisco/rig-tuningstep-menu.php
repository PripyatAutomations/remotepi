<?php
   include('config.inc.php');
   header('Content-Type: text/xml');
   header('Connection: close');
?>
<CiscoIPPhoneInput>
 <Title><?= $rig . " (" . $cur_tuning_step . ")"; ?></Title>
 <Prompt>Input desired Tuning step</Prompt>
 <URL><?= $urlbase; ?>/rig-tuningstep-set.php</URL>
 <InputItem>
  <DisplayName>Tuning Step</DisplayName>
  <QueryStringParam>step</QueryStringParam>
  <DefaultValue><?= $cur_tuning_step; ?></DefaultValue>
  <InputFlags>N</InputFlags>
 </InputItem>
</CiscoIPPhoneInput>
