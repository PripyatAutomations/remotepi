<?php
  $urlbase = 'http://10.11.0.3/cisco/';

   if (isset($_REQUEST['rig'])) {
      $rig = $_REQUEST['rig'];
   } else {
      $rig = "rig0";
   }

   function rig_get_freq($rig) {
      return "7220000";
   }

   function rig_get_tuning_step($rig) {
      return "1000";
   }

   $cur_freq = rig_get_freq($rig);
   $cur_tuning_step = rig_get_tuning_step($rig);
?>
