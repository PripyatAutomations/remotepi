#!/bin/bash
mkdir -p /opt/remotepi/etc/ssl/
cp /etc/letsencrypt/live/istabpeople.com/*.pem /opt/remotepi/etc/ssl/
chown -R devuan:devuan /opt/remotepi/etc/ssl/
service asterisk restart
/opt/remotepi/ari/remotepi-ari.pl
