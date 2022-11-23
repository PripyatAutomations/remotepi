<?php
header('Content-Type: text/xml');
header('Connection: close');
?>
<CiscoIPPhoneText>
<Title>Fortune Teller</Title>
<Prompt/>
<Text><?php echo htmlspecialchars(`/usr/games/fortune`, ENT_XML1); ?></Text>
</CiscoIPPhoneText>
