#!/bin/bash
. /opt/remotepi/etc/config.sh

PREFIX=/opt/remotepi/voices/

echo "* Downloading amazon data"
aws polly describe-voices > ${PREFIX}/aws-voices.json
aws translate list-languages > ${PREFIX}/aws-languages.json

echo "* Download gcloud data"
gcloud beta ml translate get-supported-languages --project ${GC_PID} --format=json > ${PREFIX}/gcloud-languages.json 
