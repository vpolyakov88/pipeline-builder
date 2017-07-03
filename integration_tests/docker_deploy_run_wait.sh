#!/bin/bash
docker build -t pipelinebuilder-test .
docker run -p 8081:80 -d -e USER_NAME=$1 -e API_KEY=$2 pipelinebuilder-test
response=[]
val="\"status\": \"running\""
while [[ $response != *$val* ]]; do
response=$(curl -u $1:$2 -sb -H "Accept: application/json" "https://saucelabs.com/rest/v1/$1/available_tunnels?full=true")
done
