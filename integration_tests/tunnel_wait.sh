#!/bin/bash
response=[]
val="\"status\": \"running\""
while [[ $response != *$val* ]]; do
response=$(curl -u $1:$2 -sb -H "Accept: application/json" "https://saucelabs.com/rest/v1/$1/available_tunnels?full=true")
done
