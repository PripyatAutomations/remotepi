#!/bin/bash
echo "* updating submodules..."
git submodule init
git submodule pull

echo "* Installing host packages (apt)"
sudo apt install pipewire pipewire-alsa pipewire-bin pipewire-audio-client-libraries pipewire-jack pipewire-pulse pipewire-v4l2  pipewire-doc wireplumber
sudo apt install espeak-ng libespeak-ng-dev libsamplerate-dev libsamplerate0
sudo apt install libhttp-request-params-perl libio-async-loop-epoll-perl libnet-async-http-perl libjson-perl libdata-dumper-simple-perl libhamlib-perl
sudo apt install asterisk asterisk-core-sounds-en asterisk-flite asterisk-dev asterisk-modules baresip baresip-ffmpeg 

echo "* building needed components..."
# Build chan_sccp-b to support cisco devices better
echo "* building chan_sccp-b..."
/opt/remotepi/ext/build-chan-sccp.sh

# build ardop modems
echo "* building ardop mpdems..."
/opt/remotepi/ext/build-ardop.sh

# patch novnc so we can send passwords via url
[ ! -f /opt/remotepi/src/.novnc_patched ] && {
   echo "* patching noVNC to allow passing password in URL..."
   cd /opt/remotepi/ext/noVNC
   patch -p1<../noVNC-password-in-url.patch
   touch /opt/remotepi/src/.novnc_patched
   cd -
}

echo "export PATH=\$PATH:/opt/remotepi/bin" >> /etc/profile.d/remotepi.sh
