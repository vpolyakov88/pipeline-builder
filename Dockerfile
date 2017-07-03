FROM ubuntu:16.04

ENV USER_NAME=unknown
ENV API_KEY=unknown

RUN apt-get update -qqy \
 && apt-get install -qqy \
      wget \
      nginx \
      default-jre

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist/demo.bundle.js /usr/share/nginx/html/demo.bundle.js
COPY src/index.html /usr/share/nginx/html/index.html

COPY nginx/scrun.sh /
RUN wget https://saucelabs.com/downloads/sc-4.4.7-linux.tar.gz -O - | tar -xz
ENV PATH="$PATH:/sc-4.4.7-linux/bin"

CMD /scrun.sh $USER_NAME $API_KEY \
           && nginx -g 'daemon off;' \
           && /bin/bash
