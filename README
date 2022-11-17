This is a mess while i try to merge the code in use on my
HF and VHF/UHF stations...


It probably won't be useful as it sits for you,
but if you put it at /opt/remotepi/ and run bin/build-all.sh it might work


Start up using /opt/remotepi/init/system-startup.sh then connect to asterisk.

You'll need to add the following to an extension in your asterisk config (not included):
	[remotepi]
	exten => 5000,1,NoOp()
	 same => n,Stasis(remotepi,${CONTEXT})
