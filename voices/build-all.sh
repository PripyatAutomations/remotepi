#!/bin/bash
#TARGETS="en_uk"
#TARGETS=en_in
#TARGETS=en_nz
TARGETS=en_us
TARGETS=en_au
#OFORMAT=mp3
OFORMAT=pcm
#voice=Amy
#voice=Brian
#voice=Kajal
#voice=Olivia
#voice=Aria
voice=Joanna

#for i in en_au_Olivia en_in_Kajal en_nz_Aria en_uk_Amy en_uk_Brian en_us_Joanna; do
#done

engine=neural
# [Lotte, Maxim, Ayanda, Salli, Arthur, Geraint, Miguel,
# Giorgio, Marlene, Ines, Kajal, Zhiyu, Zeina, Karl, 
# Gwyneth, Joanna, Lucia, Cristiano, Astrid, Vicki, Mia,
# Vitoria, Bianca, Chantal, Raveena, Daniel, Amy, Liam,
# Kevin, Brian, Russell, Aria, Matthew, Aditi, Dora,
# Enrique, Hans, Carmen, Ivy, Ewa, Maja, Gabrielle,
# Nicole, Filiz, Camila, Jacek, Justin, Celine, Kendra,
# Arlet, Ricardo, Mads, Hannah, Mathieu, Lea, Tatyana,
# Penelope, Naja, Olivia, Ruben, Laura, Takumi, Mizuki,
# Carla, Conchita, Jan, Kimberly, Liv, Lupe, Joey, Pedro,
# Seoyeon, Emma]

for target in ${TARGETS}; do
   LANG=$(echo ${target}|cut -f 1 -d _)

   DEST="${target}_${voice}"
   mkdir -p "${DEST}"
   for template in langs/${LANG}/*.xml; do
      IFILE="${template}"
      OFILE="${DEST}/$(basename $(echo ${template}|sed s/\.xml//g).${OFORMAT})"
      # Check if OFILE is older than the XML and remove it, if so
      [ "${IFILE}" -nt "${OFILE}" ] && rm -f "${OFILE}"

      # if file doesnt exist (anymore), request it from amazon
      if [ ! -f "${OFILE}" ]; then
         echo "* Requesting ${OFILE} from aws"
         aws polly synthesize-speech \
	 --engine ${engine} \
         --text-type ssml \
         --text "file://${IFILE}" \
         --output-format "${OFORMAT}" \
         --voice-id ${voice} \
         ${OFILE}
      else
        echo "* Skipping existing output ${OFILE}"
      fi
   done
done

cd ${target}_${voice}
for i in *.pcm; do
   echo mv $i $(echo $i|sed s%pcm%wav%)
done
cd -
