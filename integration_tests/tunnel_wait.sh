#!/bin/bash
response=[]
val=[]
while [[ $response == $val ]]; do
response=$(curl -u $1:$2 -sb -H "Accept: application/json" "https://saucelabs.com/rest/v1/$1/tunnels")
done
sleep 15
