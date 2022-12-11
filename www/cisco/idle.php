<?php
  include('config.inc.php');
Header("Content-type: text/xml");
Header("Refresh: 1800");
$wx_code = "KCRW";
?>
<CiscoIPPhoneImageFile>
  <URL>http://10.11.0.3/cisco/createpng.php?lc=<?= $wx_code; ?></URL>
</CiscoIPPhoneImageFile>
