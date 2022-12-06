#!/bin/bash
. /opt/remotepi/config.sh

echo "* Tidying filesytem..."
sudo mkdir -p /opt/remotepi/logs/asterisk
sudo chown -R ${REMOTEPI_HOST_USER}:${REMOTE_HOST_GROUP} /opt/remotepi/logs
sudo chown -R asterisk:${REMOTEPI_HOST_GROUP} /opt/remotepi/logs/asterisk

#cd /opt/remotepi/logs/
#echo "* Starting flrig-vnc"
#sudo -u ${REMOTEPI_HOST_USER} '/opt/remotepi/init/flrig-vnc.start'

#echo "* Starting pipewire, if needed"
#MYPID=$(pidof pipewire)
#[ "x${MYPID}" != "x" ] && kill -9 ${MYPID}
#pipewire 2>&1 > /opt/remotepi/log/pipewire.log &

echo "* Starting flrig-vnc"
sudo -u ${REMOTEPI_HOST_USER} '/opt/remotepi/init/flrig-vnc.start'

echo "* genconf: asterisk"
/opt/remotepi/genconf/asterisk
sudo service asterisk restart
echo "...sleeping 5 seconds..."
sleep 5

echo "* ARI startup"
sudo -u ${REMOTEPI_HOST_USER} '/opt/remotepi/ari/startup.sh'

echo "* Starting radio0 baresip"
sudo -u ${REMOTEPI_HOST_USER} '/opt/remotepi/run/baresip-launch.sh'

echo "* Starting PAT winlink client"
sudo -u ${REMOTEPI_HOST_USER} pat-winlink http &
