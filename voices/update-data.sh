#!/bin/bash
aws polly describe-voices > aws-voices.json
aws translate list-languages > aws-languages.json
