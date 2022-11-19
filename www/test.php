<?php
  // read the password, so we can send it in the URL...
  $pass = file_get_contents("/opt/remotepi/run/flrig-vnc.pass.raw");
?>
<!doctype html>
<html>
 <head>
  <title>Remote Radio Access</title>
  <script src="js/jquery-3.6.0.min.js"></script>
  <script src="js/jquery.mobile-1.4.5.min.js"></script>
  <script src="js/SIPml-api.js"></script>
  <link rel="stylesheet" href="css/dark.css"/>
 </head>
 <body>
  <div class="header" id="menu">[ft891]
  Password is: <?php readfile('../run/flrig-vnc.pass.raw'); ?>
  <a href="arrl-bands-2017.pdf" target="_new">ARRL Band Chart</a>
  </div>
  <div class="pane" id="p_flrig">
   <iframe id="if_flrig" src="http://10.11.0.3:45590/vnc_lite.html?pass=<?= $pass; ?>"></iframe>
  </div>
  <div class="pane" id="p_voice">
   <iframe id="if_sipml" src="call.html"></iframe>
  </div>
 </body>
 <!-- asynchronous loading is a bitch ;) -->
 <script>
 </script>
</html>
