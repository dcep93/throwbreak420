#!/bin/bash

set -euo pipefail

SA_KEY="$1"

# # disable billing https://console.cloud.google.com/billing/projects
# nvm install 16.13.0
# firebase projects:addfirebase $GOOGLE_CLOUD_PROJECT
# yes "" | firebase init hosting --project "$GOOGLE_CLOUD_PROJECT"
# gcloud iam service-accounts create deployer-github
# gcloud projects add-iam-policy-binding "$GOOGLE_CLOUD_PROJECT" --member="serviceAccount:deployer-github@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com" --role="roles/firebasehosting.admin"
# gcloud iam service-accounts keys create gac.json --iam-account "deployer-github@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com"
# cat gac.json # SA_KEY github secret

cd throwbreak420

export GOOGLE_APPLICATION_CREDENTIALS="gac.json"
echo "$SA_KEY" >"$GOOGLE_APPLICATION_CREDENTIALS"
npm install -g firebase-tools
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
project_id="$(cat $GOOGLE_APPLICATION_CREDENTIALS | jq -r .project_id)"

cat <<EOF >firebase.json
{
    "hosting": {
        "public": "build",
        "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
        "rewrites": [{
            "source": "**",
            "destination": "/index.html"
        }],
        "headers": [{
            "source": "**/*.@(mp4)",
            "headers": [ {
                "key": "Cache-Control",
                "value": "max-age=604800"
            } ]
        }]
    }
}
EOF

cat <<EOF >.firebaserc
{
    "projects": {
        "default": "$project_id"
    }
}
EOF

firebase deploy --project "$project_id"
