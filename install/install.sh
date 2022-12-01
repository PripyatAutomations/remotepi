#!/bin/bash
[ ! -f /opt/remotepi/etc/config.sh ] && {
   echo "* Please put this stuff at /opt/remotepi/ and make sure etc/config.sh exists"
   exit 1
}

. /opt/remotepi/etc/config.sh

echo "* updating submodules..."
git submodule init
git submodule pull

echo "* Installing host packages (apt)"
# remove this temporarily XXX: Fix pipewire stuff ASAP
sudo apt purge pipewire pipewire-alsa pipewire-bin pipewire-audio-client-libraries pipewire-jack pipewire-pulse pipewire-v4l2  pipewire-doc wireplumber
# install stuff
sudo apt install espeak-ng libespeak-ng-dev libsamplerate-dev libsamplerate0
sudo apt install libhttp-request-params-perl libio-async-loop-epoll-perl libnet-async-http-perl libjson-perl libdata-dumper-simple-perl libhamlib-perl librpc-xml-perl
sudo apt install asterisk asterisk-core-sounds-en asterisk-flite asterisk-dev asterisk-modules baresip baresip-ffmpeg 

echo "* building needed components..."
# Build chan_sccp-b to support cisco devices better

echo "=> chan_sccp-b..."
/opt/remotepi/ext/build-chan-sccp.sh

# build ardop modems
echo "=> ardop modems..."
/opt/remotepi/ext/build-ardop.sh

# patch novnc so we can send passwords via url
[ ! -f /opt/remotepi/ext/.novnc_patched ] && {
   echo "! patching noVNC to allow passing password in URL..."
   cd /opt/remotepi/ext/noVNC
   patch -p1<../noVNC-password-in-url.patch
   touch /opt/remotepi/ext/.novnc_patched
   cd -
}

[ ! -s /var/lib/asterisk/sounds/remotepi ] && {
   ln -s /opt/remotepi/voices /var/lib/asterisk/sounds/remotepi
}

echo "* Fixing permissions..."
sudo chown -R ${REMOTEPI_HOST_USER}:${REMOTEPI_HOST_GROUP} /opt/remotepi
sudo chown -R asterisk:${REMOTEPI_HOST_GROUP} /opt/remotepi/etc/asterisk

echo "* Adding to PATH (profile.d)"
echo "export PATH=\$PATH:/opt/remotepi/bin" >> /etc/profile.d/remotepi.sh

echo "* Fetching dark theme..."
/opt/remotepi/install/tasks/fetch-dark-gtk-theme

echo "* Installing homedir files to ${REMOTEPI_HOST_USER}"
/opt/remotepi/install/tasks/install-homedir

echo "**** Install Done ****"
