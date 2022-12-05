#!/bin/bash
TARGETS="polly/en_au_Olivia:neural \
	 polly/en_gb_Amy:neural \
	 polly/en_gb_Brian:neural \
	 polly/en_in_Kajal:neural \
	 polly/en_nz_Aria:neural \
	 polly/en_us_Joanna:neural \
	 polly/en_us_Matthew:neural \
	 polly/en_nl_Laura:neural \
	 polly/en_de_Vicki:neural \
	 polly/en_de_Daniel:neural \
	 polly/en_zh_Zhiyu:neural \
	 polly/hi_in_Kajal:neural \
	 polly/fr_fr_Celine:standard \
	 polly/zh_zh_Zhiyu:neural \
	 polly/es_us_Lupe:neural \
	 polly/es_mx_Mia:neural \
	 polly/is_is_Dora:standard \
	 polly/ar_ar_Hala:neural \
	 polly/it_it_Bianca:neural \
	 polly/cy_cy_Gwyneth:standard \
	 polly/da_da_Naja:standard \
	 polly/ko_ko_Seoyeon:neural \
	 polly/ja_ja_Takumi:neural \
	 polly/no_no_Ida:neural \
	 polly/nl_nl_Laura:neural \
	 polly/pl_pl_Ola:neural \
	 polly/pt_br_Camila:neural \
	 polly/ru_ru_Tatyana:standard \
	 polly/ro_ro_Carmen:standard \
	 polly/sv_se_Elin:neural \
	 polly_tr_tr_Filiz:standard \
	 polly/de_de_Daniel:neural"
#	 gcloud/"
#TARGETS="polly/en_us_Matthew:neural"
for i in ${TARGETS}; do
   SERVICE=$(echo $i | cut -f 1 -d '/')
   VOICEID=$(echo $i | cut -f 2 -d '/')
   FULLVOICE=$(echo ${VOICEID} | cut -f 1 -d ':')
   ENGINE=$(echo ${VOICEID} | cut -f 2 -d ':')
   LOCALE=$(echo ${FULLVOICE} | cut -f 1-2 -d '_')
   SPEAKER=$(echo ${FULLVOICE} | cut -f 3 -d '_')
   if [ ${SERVICE} == polly ]; then
      /opt/remotepi/voices/build-polly-voice.sh ${ENGINE} ${SPEAKER} ${LOCALE} || exit 1
   fi
   if [ ${SERVICE} == gcloud ]; then
      /opt/remotepi/voices/build-gcloud-voice.sh ${ENGINE} ${SPEAKER} ${LOCALE} || exit 2
   fi
done
