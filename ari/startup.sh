#!/bin/bash
while true; do
   echo "[$(date +%Y-%m-%d.%H%M%S)] (re)starting..." >> /opt/remotepi/logs/remotepi-ari.log
   /opt/remotepi/ari/remotepi-ari.pl
   sleep 15
done

