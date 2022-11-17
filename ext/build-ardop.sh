#!/bin/bash
cd /opt/remotepi/ext/ardop

# build ARDOP2
cd ARDOP2
make
cp ardop2 /opt/remotepi/bin/
cd ..

# build ARDOPC
cd ARDOPC
make
cp ardopc /opt/remotepi/bin
cd ..

# build ARDOP1OFDM
cd ARDOP1OFDM
make
cp ardop1ofdm /opt/remotepi/bin
cd ..

# build ARDOPOFDM
cd ARDOPOFDM
make
cp ardopofdm /opt/remotepi/bin
cd ..
