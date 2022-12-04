#!/bin/bash
# Call me as build-polly-voice.sh <engine> <speaker> <locale>
#
if [ -z $3 -o -z $2 -o -z $1 ]; then
   echo "Invalid usage. see build-all-voices.sh"
   exit 100
fi

ENGINE=$1
SPEAKER=$2
LOCALE=$3

DEST="${LOCALE}_${SPEAKER}"
mkdir -p "${DEST}"
OWD=$(pwd)

TEMPLATE_LOCALE=$(echo ${LOCALE} | cut -f 1 -d '_')

for template in langs/${TEMPLATE_LOCALE}/*.xml; do
   IFILE="${template}"
   BASEFILE="$(basename $echo ${IFILE}|sed s\/.xml//g)"
   OFILE="${BASEFILE}.mp3"

   # Check if OFILE is older than the XML and remove it, if so 
   if [ -f "${DEST}/${OFILE}" -a "${IFILE}" -nt "${DEST}/${OFILE}" ]; then
      echo "* rm stale ${DEST}/${BASEFILE}.*"
      rm -f ${DEST}/${BASEFILE}.*
   fi

   # XXX: Check for a locale/voice specific override in langs/${LOCALE} or langs/${LOCALE}/${SPEAKER}/

   # if file doesnt exist (anymore), request it from amazon
   if [ ! -f "${DEST}/${OFILE}" ]; then
      echo "* Requesting ${DEST}/${OFILE} from aws: "
      aws polly synthesize-speech \
      --engine ${ENGINE} \
      --text-type ssml \
      --text "file:///opt/remotepi/voices/${IFILE}" \
      --output-format "mp3" \
      --voice-id ${SPEAKER} \
      ${DEST}/${OFILE} 2>&1 >/dev/null || exit 1
      echo "* Converting media..."
      bname=$(echo ${OFILE}|sed -e s%.mp3%%)
      echo "=> converting ${DEST}/${bname} to ulaw, alaw, gsm, and g722, as needed"
      [ "${DEST}/${OFILE}" -nt "${DEST}/${bname}.ulaw" ] && (sox -V ${DEST}/${OFILE} -r 8000 -c 1 -t ul ${DEST}/${bname}.ulaw 2>&1 >/dev/null || exit 2)
      [ "${DEST}/${OFILE}" -nt "${DEST}/${bname}.alaw" ] && ( sox -V ${DEST}/${OFILE} -r 8000 -c 1 -t al ${DEST}/${bname}.alaw 2>&1 >/dev/null || exit 3)
      [ "${DEST}/${OFILE}" -nt "${DEST}/${bname}.gsm" ] && (sox -V ${DEST}/${OFILE} -r 8000 -c 1 -t gsm ${DEST}/${bname}.gsm 2>&1 >/dev/null || exit 4)
      [ "${DEST}/${OFILE}" -nt "${DEST}/${bname}.g722" ] && (ffmpeg -i ${DEST}/${OFILE} -ar 16000 -acodec g722 ${DEST}/${bname}.g722 2>&1 >/dev/null || exit 5)
   else
     echo "* Skipping existing media ${LOCALE}_${SPEAKER}/${OFILE}"
   fi
done
cd ${OWD}
