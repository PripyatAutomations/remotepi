#!/bin/bash
cd /opt/remotepi/ext/chan-sccp
# not fatal if this fails
git pull || exit 1

OS_TRIPLE=$(gcc -dumpmachine)
./configure --prefix=/usr --with-astmoddir=/usr/lib/${OS_TRIPLE}/asterisk/modules
make
sudo make install
