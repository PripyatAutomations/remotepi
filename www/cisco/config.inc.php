<?php
   ini_set('error_reporting', E_ALL);
   ini_set("display_errors", 1);
   $urlbase = 'http://10.11.0.3/cisco/';
   $voice_vlan = "1";
   $pc_vlan = "1";
   $asterisk_host = "10.11.0.3";
   $www_prefix = "http://10.11.0.3/";
   $ssh_port = 22;
   $ssh_user = "admin";
   $ssh_pass = "FDJKfdnMRW4Ehj45FHSR7";

   // Uncomment to enable log host (disable to save bandwidth)
   //$log_host = "10.11.0.3";
   //$syslog_host = "10.11.0.3";
   //$debug_host = "10.11.0.3";
   //$debug_level = 3;
   if (isset($_REQUEST['rig'])) {
      $rig = $_REQUEST['rig'];
   } else {
      $rig = "rig0";
   }

   if (isset($_REQUEST['locale'])) {
      $locale = $_REQUEST['locale'];
   } else
      $locale = "";

   if (isset($_REQUEST['name'])) {
      $cisco_name = $_REQUEST['name'];
   } else
      $cisco_name = "";

   function rig_get_freq($rig) {
      return "7220000";
   }

   function rig_get_tuning_step($rig) {
      return "1000";
   }

   function rig_get_power($rig) {
      return "50W";
   }

   function rig_get_station_mode($rig) {
      return "phone";
   }

   function rig_get_modulation_mode($rig) {
      return "LSB";
   }

   function rig_get_dnr($rig) {
      return "off";
   }

   $cur_freq = rig_get_freq($rig);
   $cur_tuning_step = rig_get_tuning_step($rig);
   $cur_power = rig_get_power($rig);
?>
