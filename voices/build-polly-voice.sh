#!/bin/bash
# Call me as build-polly-voice.sh <engine> <speaker> <locale>
#
ENGINE=$1
SPEAKER=$2
LOCALE=$3

DEST="${LOCALE}_${SPEAKER}"
mkdir -p "${DEST}"

TEMPLATE_LOCALE=$(echo ${LOCALE} | cut -f 1 -d '_')
OWD=$(pwd)

for template in langs/${TEMPLATE_LOCALE}/*.xml; do
   cd ${DEST}
   IFILE="${template}"
   OFILE="$(basename $(echo ${IFILE}|sed s/\.xml//g).mp3)"
   # Check if OFILE is older than the XML and remove it, if so
   [ "${IFILE}" -nt "${OFILE}" ] && rm -f "${OFILE}"

   # XXX: Check for a locale/voice specific override in langs/${LOCALE} or langs/${LOCALE}/${SPEAKER}/

   # if file doesnt exist (anymore), request it from amazon
   if [ ! -f "${OFILE}" ]; then
      echo "* Requesting ${LOCALE}_${SPEAKER}/${OFILE} from aws: "
      aws polly synthesize-speech \
      --engine ${ENGINE} \
      --text-type ssml \
      --text "file:///opt/remotepi/voices/${IFILE}" \
      --output-format "mp3" \
      --voice-id ${SPEAKER} \
      ${OFILE} 2>&1 >/dev/null || exit 1
      echo "* Converting media..."
      bname=$(echo ${OFILE}|sed -e s%.mp3%%)
      echo "=> converting ${LOCALE}_${SPEAKER}/${bname} to ulaw, alaw, gsm, and g722"
      sox -V ${OFILE} -r 8000 -c 1 -t ul ${bname}.ulaw 2>&1 >/dev/null || exit 2
      sox -V ${OFILE} -r 8000 -c 1 -t al ${bname}.alaw 2>&1 >/dev/null || exit 3
      sox -V ${OFILE} -r 8000 -c 1 -t gsm ${bname}.gsm 2>&1 >/dev/null || exit 4
      ffmpeg -i ${OFILE} -ar 16000 -acodec g722 ${bname}.g722 2>&1 >/dev/null || exit 5
   else
     echo "* Skipping existing output ${LOCALE}_${SPEAKER}/${OFILE}"
   fi
   cd ${OWD}
done
