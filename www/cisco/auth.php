<?php
 /*
 If you want to Push an XML Object to a Cisco IP Phone, it first tries to authenticate your request against a Call Manager. If you don’t have a Call Manager (e.g. you’re using Asterisk), then you can use “<authenticationURL></authenticationURL>” in the SEP<MAC>.cnf.xml. The phone can then be directed to any web server which handles the authentication.
 Data transferred:
 1) The Push is done by posting a “CiscoIPPhoneExecute” with the URL of the Object you want to be loaded. The POSTing has to be directed to the phone at the URL “/CGI/Execute” and must use HTTP Basic Authentication.
 2) The phone POSTs ‘UserID’, ‘Password’ and ‘devicename’
 3) The server answers ‘ERROR’, ‘UN-AUTHORIZED’ or ‘AUTHORIZED’ (ensure no headers sent and no extra characters. The phone will respond with a ‘CiscoIPPhoneError Number=”4″‘ if it receives anything extra.)
*/
 echo “AUTHORIZED”;
?>