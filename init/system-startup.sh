#!/bin/bash
echo "* Starting flrig-vnc"
sudo -u devuan '/opt/remotepi/init/flrig-vnc.start'
echo "* genconf: asterisk"
/opt/remotepi/genconf/asterisk
echo "* ARI startup"
sudo -u devuan '/opt/remotepi/ari/startup.sh'
echo "* Starting radio0 baresip"
sudo -u devuan '/opt/remotepi/run/baresip-launch.sh'
