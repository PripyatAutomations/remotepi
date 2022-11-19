#!/bin/bash
echo "* Tidying filesytem..."
sudo mkdir -p /opt/remotepi/logs/asterisk
sudo chown -R devuan:devuan /opt/remotepi/logs
sudo chown -R asterisk:devuan /opt/remotepi/logs/asterisk
cd /opt/remotepi/logs/

echo "* Starting flrig-vnc"
sudo -u devuan '/opt/remotepi/init/flrig-vnc.start'

echo "* genconf: asterisk"
/opt/remotepi/genconf/asterisk

echo "* ARI startup"
sudo -u devuan '/opt/remotepi/ari/startup.sh'

echo "* Starting radio0 baresip"
sudo -u devuan '/opt/remotepi/run/baresip-launch.sh'
