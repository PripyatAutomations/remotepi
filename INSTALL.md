chroot
------
It might be possible to install the devuan based system as a chroot.

I'll need to do some work to block X11 deps to reduce the system size (if
desired - you may wish to use wsjtx, etc).

* Mount media at /mnt (similar command)
	# sudo mount /dev/sdb1 /mnt

* Run installer
	sudo /opt/remotepi/install/chroot-install.sh

Hosted (dpkg/apt based systems such as Devuan):
* Mount media at /mnt (similar command)
	# sudo mount /dev/sdb1 /mnt

* Run installer
	sudo /opt/remotepi/install/install.sh
