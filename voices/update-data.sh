#!/bin/bash
echo "* Downloading amazon data"
aws polly describe-voices > aws-voices.json
aws translate list-languages > aws-languages.json
