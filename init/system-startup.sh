#!/bin/bash
echo "* Tidying filesytem..."
sudo mkdir -p /opt/remotepi/logs/asterisk
sudo chown -R devuan:devuan /opt/remotepi/logs
sudo chown -R asterisk:devuan /opt/remotepi/logs/asterisk

cd /opt/remotepi/logs/

echo "* Starting flrig-vnc"
sudo -u devuan '/opt/remotepi/init/flrig-vnc.start'

echo "* Starting pipewire, if needed"
MYPID=$(pidof pipewire)
[ "x${MYPID}" != "x" ] && kill -9 ${MYPID}
pipewire 2>&1 > /opt/remotepi/log/pipewire.log &

echo "* Starting flrig-vnc"
sudo -u devuan '/opt/remotepi/init/flrig-vnc.start'

echo "* genconf: asterisk"
/opt/remotepi/genconf/asterisk

echo "* ARI startup"
sudo -u devuan '/opt/remotepi/ari/startup.sh'

echo "* Starting radio0 baresip"
sudo -u devuan '/opt/remotepi/run/baresip-launch.sh'

echo "* Starting PAT winlink client"
sudo -u devuan pat http &

