#!/bin/bash
TARGETS="polly/en_au_Olivia:neural \
	 polly/en_in_Kajal:neural \
	 polly/en_nz_Aria:neural \
	 polly/en_gb_Amy:neural \
	 polly/en_gb_Brian:neural \
	 polly/en_us_Joanna:neural"

for i in ${TARGETS}; do
   SERVICE=$(echo $i | cut -f 1 -d '/')
   VOICEID=$(echo $i | cut -f 2 -d '/')
   FULLVOICE=$(echo ${VOICEID} | cut -f 1 -d ':')
   ENGINE=$(echo ${VOICEID} | cut -f 2 -d ':')
   LOCALE=$(echo ${FULLVOICE} | cut -f 1-2 -d '_')
   SPEAKER=$(echo ${FULLVOICE} | cut -f 3 -d '_')
   /opt/remotepi/voices/build-polly-voice.sh ${ENGINE} ${SPEAKER} ${LOCALE}
done

