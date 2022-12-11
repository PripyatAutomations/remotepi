<?php
  include('config.inc.php');
   /*
   * If you want to Push an XML Object to a Cisco IP Phone, it first tries to authenticate your request against a Call Manager. If you don’t have a Call Manager (e.g. you’re using Asterisk), then you can use “<authenticationURL></authenticationURL>” in the SEP<MAC>.cnf.xml. The phone can then be directed to any web server which handles the authentication.
   * Data transferred:
   *  1) The Push is done by posting a “CiscoIPPhoneExecute” with the URL of the Object you want to be loaded. The POSTing has to be directed to the phone at the URL “/CGI/Execute” and must use HTTP Basic Authentication.
   *  2) The phone POSTs ‘UserID’, ‘Password’ and ‘devicename’
   *  3) The server answers ‘ERROR’, ‘UN-AUTHORIZED’ or ‘AUTHORIZED’ (ensure no headers sent and no extra characters. The phone will respond with a ‘CiscoIPPhoneError Number=”4″‘ if it receives anything extra.)
   */
#   ob_flush();
#   ob_start();
#   echo "***REQUEST***\n";
#   var_dump($_REQUEST);
#   echo "***SERVER***\n";
#   var_dump($_SERVER);
#   file_put_contents("/tmp/lastauth.log", ob_get_flush());
#   ob_end_flush();

   $devname = $pass = $uid = "INVALID";

   if (isset($_REQUEST['devicename'])) {
      $devname = $_REQUEST['devicename'];
   }

   if (isset($_REQUEST['UserID'])) {
      $uid = $_REQUEST['UserID'];
   }

   if (isset($_REQUEST['Password'])) {
      $pass = $_REQUEST['Password'];
   }

   echo "AUTHORIZED";
   $fp = fopen("/tmp/auth.log", "a");
   $out = "IP=" . $_SERVER['REMOTE_ADDR'] . " (" . $devname . ") => OK (User: " . $uid . ", Pass: " . $pass . ")\n";
   fwrite($fp, $out);
   fclose($fp);
?>