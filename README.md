Excuse the mess while i clean this up for publication....

This 'must' live at /opt/remotepi otherwise a lot of editing will be
required... Feel free to submit patches to deal with this in a friendly way!

Install:
	cd /opt
	git clone https://github.com/PripyatAutomations/remotepi.git
	sudo /opt/remotepi/bin/install.sh

Move /etc/asterisk out of the way and make a symlink to /opt/remotepi/etc/asterisk
	sudo mv /etc/asterisk{.,old}
	sudo ln -s /opt/remotepi/etc/asterisk /etc/

Edit asterisk configurations.

You'll need to make extension or at least call Statis(remotepi,${CONTEXT}) to make this work:
	[remotepi]
	exten => 5000,1,NoOp()
	 same => n,Stasis(remotepi,${CONTEXT})

You'll need to modify the supplied configurations.

Start up using /opt/remotepi/init/system-startup.sh then connect to asterisk.


CONFIGURING
-----------
edit /opt/remotepi/etc/remotepi.ini

SECURITY
--------
There literally is NONE. Use VPN access to the machine to protect/control access. 0.2 release will address this.

CONTROLLING
-----------
See ari/README.md for information about how to control the station via DTMF

