Excuse the mess while i clean this up for publication....


Install:
	cd /opt
	git clone https://github.com/PripyatAutomations/remotepi.git
	sudo /opt/remotepi/bin/install.sh

Start up using /opt/remotepi/init/system-startup.sh then connect to asterisk.

You'll need to add the following to an extension in your asterisk config (not included):
	[remotepi]
	exten => 5000,1,NoOp()
	 same => n,Stasis(remotepi,${CONTEXT})

You'll need to modify the supplied configurations.


CONFIGURING
-----------
edit /opt/remotepi/etc/remotepi.ini

SECURITY
--------
There literally is NONE. Use VPN access to the machine to protect/control access. 0.2 release will address this.

CONTROLLING
-----------
See ari/README.md for information about how to control the station via DTMF

