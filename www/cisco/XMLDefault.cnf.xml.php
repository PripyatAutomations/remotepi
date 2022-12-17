<?php
 // generate the default configuration
 header('Content-type: text/xml');
 include('config.inc.php');
?>
<Default>
 <fullConfig>true</fullConfig>
 <ipAddressMode>2</ipAddressMode>
 <allowAutoConfig>true</allowAutoConfig>
 <ipPreferenceModeControl>2</ipPreferenceModeControl>
 <callManagerGroup>
  <members>
   <member priority="0">
    <callManager>
     <ports>
      <ethernetPhonePort>2000</ethernetPhonePort>
      <mgcpPorts>
       <listen>2427</listen>
       <keepAlive>2428</keepAlive>
      </mgcpPorts>
     </ports>
     <processNodeName><?= $asterisk_host; ?></processNodeName>
    </callManager>
   </member>
  </members>
 </callManagerGroup>
 <loadInformation1 model="IP Phone 7945">SCCP45.9-4-2SR4-3S</loadInformation1>
 <loadInformation2 model="IP Phone 7965">SCCP45.9-4-2SR4-3S</loadInformation2>
 <vendorConfig>
<?php if (isset($log_host)) { ?>
  <logServer><?= $log_host; ?></logServer>
<?php } ?>
<?php if (isset($syslog_host)) { ?>
  <syslogServer>10.11.0.3</syslogServer>
<?php } ?>
<?php if (isset($debug_host)) { ?>
  <debugServer>10.11.0.3</debugServer>
  <?php if (isset($debug_level)) { ?>
  <debugLevel>3</debugLevel>
  <?php } ?>
<?php } ?>
  <disableSpeaker>false</disableSpeaker>
  <disableSpeakerAndHeadset>false</disableSpeakerAndHeadset>
  <forwardingDelay>1</forwardingDelay>
  <pcPort>1</pcPort>
  <settingsAccess>1</settingsAccess>
  <garp>0</garp>
  <voiceVlanAccess>1</voiceVlanAccess>
  <spanToPCPort>1</spanToPCPort>
  <videoCapability>0</videoCapability>
  <autoSelectLineEnable>0</autoSelectLineEnable>
  <webAccess>1</webAccess>
  <daysDisplayNotActive>1,7</daysDisplayNotActive>
  <displayOnTime>06:30</displayOnTime>
  <displayOnDuration>14:00</displayOnDuration>
  <displayIdleTimeout>01:00</displayIdleTimeout>
  <displayOnWhenIncomingCall>1</displayOnWhenIncomingCall>
  <loggingDisplay>1</loggingDisplay>
  <autoCallSelect>0</autoCallSelect>
  <g722CodecSupport>2</g722CodecSupport>
  <headsetWidebandUIControl>1</headsetWidebandUIControl>
  <handsetWidebandUIControl>1</handsetWidebandUIControl>
  <headsetWidebandEnable>1</headsetWidebandEnable>
  <handsetWidebandEnable>1</handsetWidebandEnable>
  <peerFirmwareSharing>1</peerFirmwareSharing>
  <enableCdpSwPort>1</enableCdpSwPort>
  <enableCdpPcPort>1</enableCdpPcPort>
  <enableLldpSwPort>1</enableLldpSwPort>
  <enableLldpPcPort>1</enableLldpPcPort>
  <lldpAssetId>Cisco Phone</lldpAssetId>
  <powerPriority>1</powerPriority>
  <sshAccess>1</sshAccess>
  <sshPort>22</sshPort>
  <detectCMConnectionFailure>0</detectCMConnectionFailure>
  <useEnblocDialing>1</useEnblocDialing>
 </vendorConfig>
 <authenticationURL><?= $www_prefix; ?>/cisco/auth.php</authenticationURL>
 <directoryURL><?= $www_prefix; ?>/cisco/directory.php</directoryURL>
 <idleURL><?= $www_prefix; ?>/cisco/idle.php</idleURL>
 <informationURL><?= $www_prefix; ?>/cisco/help.php</informationURL>
 <messagesURL><?= $www_prefix; ?>/cisco/messages.php</messagesURL>
 <servicesURL><?= $www_prefix; ?>/cisco/services.php</servicesURL>
</Default>
