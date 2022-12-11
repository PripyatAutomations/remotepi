<?php
   include('config.inc.php');
   header('Content-Type: text/xml');
   header('Connection: close');

   if (isset($_REQUEST['rig'])) {
      $rig = $_REQUEST['rig'];
   } else {
      $rig = "rig0";
   }
?>
