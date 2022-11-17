#!/bin/bash
echo "* fetching git submodules..."
git submodule init
git submodule update

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
