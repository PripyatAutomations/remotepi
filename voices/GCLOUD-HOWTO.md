* Create a project remotepi
* Enable IAM, tts, translation services

* Create access keys
	gcloud auth application-default login
	gcloud auth login
	gcloud config set project remotepi-370618

* setup quotas
	gcloud auth application-default set-quota-project remotepi-370618 
