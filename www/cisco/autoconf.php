<?php
  include('/opt/remotepi/www/cisco/config.inc.php');
  header('Content-type: text/xml');

  // Here we generate a configuration for the phone attempting to boot
  // XXX: Figure out the phone's MAC from filename
  // XXX: SEP<MAC>.xml
  $phone_mac = $_REQUEST['mac'];
  $phone_label = "Skynet";
?>
<device xsi:type="axl:XIPPhone" ctiid="1234567890">
<phonePersonalization>1</phonePersonalization>
<deviceProtocol>SCCP</deviceProtocol>
<sshUserId><?= $ssh_user; ?></sshUserId>
<sshPassword><?= $ssh_pass;?></sshPassword>
<devicePool>
 <dateTimeSetting>
  <dateTemplate>M/D/Y</dateTemplate>
  <timeZone>UTC</timeZone>
  <ntps>
   <ntp>
   <name>0.pool.ntp.org</name>
   <ntpMode>Unicast</ntpMode>
  </ntp>
  </ntps>
 </dateTimeSetting>
 <callManagerGroup>
  <members>
   <member priority="0">
    <callManager>
     <ports>
      <ethernetPhonePort>2000</ethernetPhonePort>
      <sipPort>5060</sipPort>
      <securedSipPort>5061</securedSipPort>
     </ports>
     <processNodeName><?= $asterisk_host; ?></processNodeName>
    </callManager>
   </member>
  </members>
 </callManagerGroup>
</devicePool>
<sipProfile>
 <sipProxies>
  <registerWithProxy>true</registerWithProxy>
 </sipProxies>
 <sipCallFeatures>
  <AdvanceAdhocConference>false</AdvanceAdhocConference>
  <cnfJoinEnabled>false</cnfJoinEnabled>
  <callForwardURI>x-cisco-serviceuri-cfwdall</callForwardURI>
  <callPickupURI>x-cisco-serviceuri-pickup</callPickupURI>
  <callPickupListURI>x-cisco-serviceuri-opickup</callPickupListURI>
  <callPickupGroupURI>x-cisco-serviceuri-gpickup</callPickupGroupURI>
  <meetMeServiceURI>x-cisco-serviceuri-meetme</meetMeServiceURI>
  <abbreviatedDialURI>x-cisco-serviceuri-abbrdial</abbreviatedDialURI>
  <rfc2543Hold>false</rfc2543Hold>
  <callHoldRingback>2</callHoldRingback>
  <localCfwdEnable>false</localCfwdEnable>
  <semiAttendedTransfer>true</semiAttendedTransfer>
  <anonymousCallBlock>2</anonymousCallBlock>
  <callerIdBlocking>2</callerIdBlocking>
  <dndControl>0</dndControl>
  <remoteCcEnable>true</remoteCcEnable>
 </sipCallFeatures>
 <sipStack>
  <sipInviteRetx>6</sipInviteRetx>
  <sipRetx>10</sipRetx>
  <timerInviteExpires>180</timerInviteExpires>
  <!-- Force short registration timeout to keep NAT connection alive -->
  <timerRegisterExpires>180</timerRegisterExpires>
  <timerRegisterDelta>5</timerRegisterDelta>
  <timerKeepAliveExpires>120</timerKeepAliveExpires>
  <timerSubscribeExpires>120</timerSubscribeExpires>
  <timerSubscribeDelta>5</timerSubscribeDelta>
  <timerT1>500</timerT1>
  <timerT2>4000</timerT2>
  <maxRedirects>70</maxRedirects>
  <remotePartyID>false</remotePartyID>
  <userInfo>None</userInfo>
 </sipStack>
 <autoAnswerTimer>1</autoAnswerTimer>
 <autoAnswerAltBehavior>false</autoAnswerAltBehavior>
 <autoAnswerOverride>false</autoAnswerOverride>
 <transferOnhookEnabled>false</transferOnhookEnabled>
 <enableVad>false</enableVad>
 <preferredCodec>none</preferredCodec>
 <dtmfAvtPayload>101</dtmfAvtPayload>
 <dtmfDbLevel>3</dtmfDbLevel>
 <dtmfOutofBand>avt</dtmfOutofBand>
 <alwaysUsePrimeLine>true</alwaysUsePrimeLine>
 <alwaysUsePrimeLineVoiceMail>false</alwaysUsePrimeLineVoiceMail>
 <kpml>3</kpml>
 <natEnabled>false</natEnabled>
 <natAddress></natAddress>
 <phoneLabel><?= $phone_label; ?></phoneLabel>
 <stutterMsgWaiting>1</stutterMsgWaiting>
 <callStats>true</callStats>
 <silentPeriodBetweenCallWaitingBursts>10</silentPeriodBetweenCallWaitingBursts>
 <disableLocalSpeedDialConfig>false</disableLocalSpeedDialConfig>
 <startMediaPort>16384</startMediaPort>
 <stopMediaPort>16391</stopMediaPort>
 <sipLines>
 <line button="1">
 <featureID>9</featureID>
 <featureLabel>Skynet</featureLabel>
 <proxy>USECALLMANAGER</proxy>
 <port>5060</port>
 <name>c79451</name>
 <displayName>Skynet</displayName>
 <autoAnswer>
 <autoAnswerEnabled>2</autoAnswerEnabled>
 </autoAnswer>
 <callWaiting>3</callWaiting>
 <authName>admin</authName>
 <authPassword>FDJKfdnMRW4Ehj45FHSR7</authPassword>
 <sharedLine>false</sharedLine>
 <messageWaitingLampPolicy>3</messageWaitingLampPolicy>
 <messagesNumber>501</messagesNumber>
 <ringSettingIdle>4</ringSettingIdle>
 <ringSettingActive>5</ringSettingActive>
 <contact>502</contact>
 <forwardCallInfoDisplay>
 <callerName>true</callerName>
 <callerNumber>false</callerNumber>
 <redirectedNumber>false</redirectedNumber>
 <dialedNumber>true</dialedNumber>
 </forwardCallInfoDisplay>
 </line>
 <line button="2">
 <featureID>21</featureID>
 <featureLabel>INTERCOM</featureLabel>
 <speedDialNumber>300</speedDialNumber>
 </line>
 </sipLines>
 <voipControlPort>5060</voipControlPort>
 <dscpForAudio>184</dscpForAudio>
 <ringSettingBusyStationPolicy>0</ringSettingBusyStationPolicy>
 <dialTemplate>dialplan.xml</dialTemplate>
</sipProfile>
<commonProfile>
 <phonePassword></phonePassword>
 <backgroundImageAccess>true</backgroundImageAccess>
 <callLogBlfEnabled>3</callLogBlfEnabled>
</commonProfile>
<loadInformation>SCCP45.9-4-2SR4-3S</loadInformation>
<vendorConfig>
 <disableSpeaker>false</disableSpeaker>
 <disableSpeakerAndHeadset>false</disableSpeakerAndHeadset>
 <pcPort>0</pcPort>
 <settingsAccess>1</settingsAccess>
 <garp>0</garp>
 <voiceVlanAccess>0</voiceVlanAccess>
 <videoCapability>0</videoCapability>
 <autoSelectLineEnable>0</autoSelectLineEnable>
 <webAccess>0</webAccess>
 <sshAccess>0</sshAccess>
 <sshPort><?= $ssh_port; ?></sshPort>
 <daysDisplayNotActive></daysDisplayNotActive>
 <displayOnTime>00:00</displayOnTime>
 <displayOnDuration>23:59</displayOnDuration>
 <displayIdleTimeout>23:59</displayIdleTimeout>
 <spanToPCPort>0</spanToPCPort>
 <loggingDisplay>0</loggingDisplay>
 <loadServer></loadServer>
 <g722CodecSupport>2</g722CodecSupport>
</vendorConfig>
<versionStamp></versionStamp>
<userLocale>
 <name>English_United_States</name>
<uid>1</uid>
 <langCode>en_US</langCode>
<version>1.0.0.0-1</version>
 <winCharSet>iso-8859-1</winCharSet>
</userLocale>
<networkLocale>United_States</networkLocale>
<networkLocaleInfo>
 <name>United_States</name>
<uid>64</uid>
 <version>1.0.0.0-1</version>
</networkLocaleInfo>
<deviceSecurityMode>0</deviceSecurityMode>
<proxyServerURL></proxyServerURL>
<authenticationURL><?= $www_prefix; ?>/cisco/auth.php</authenticationURL>
<directoryURL><?= $www_prefix; ?>/cisco/directory.php</directoryURL>
<idleURL><?= $www_prefix; ?>/cisco/idle.php</idleURL>
<informationURL><?= $www_prefix; ?>/cisco/infong</informationURL>
<messagesURL><?= $www_prefix; ?>/cisco/messages.php</messagesURL>
<servicesURL><?= $www_prefix; ?>/cisco/services.php</servicesURL>
<dscpForSCCPPhoneConfig>96</dscpForSCCPPhoneConfig>
<dscpForSCCPPhoneServices>0</dscpForSCCPPhoneServices>
<dscpForCm2Dvce>96</dscpForCm2Dvce>
<transportLayerProtocol>2</transportLayerProtocol>
<capfAuthMode>0</capfAuthMode>
<capfList>
 <capf>
 <phonePort>3804</phonePort>
 </capf>
</capfList>
<certHash></certHash>
<encrConfig>false</encrConfig>
<advertiseG722Codec>1</advertiseG722Codec>
</device>
