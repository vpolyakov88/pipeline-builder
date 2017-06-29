FROM ubuntu:16.04

ENV USER_NAME=unknown
ENV API_KEY=unknown

RUN apt-get update -qqy \
 && apt-get install -qqy \
      wget \
  && apt-get install -qqy \
      nginx \
  && apt-get install default-jre -qqy \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
 && useradd --no-create-home nginx

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html/
COPY src/index.html /usr/share/nginx/html/index.html
COPY src/pipeline.scss /usr/share/nginx/html/pipeline.scss
COPY src/app.js /usr/share/nginx/html/app.js

COPY nginx/scrun.sh /
RUN wget https://saucelabs.com/downloads/sc-4.4.7-linux.tar.gz -O - | tar -xz
RUN chmod a+x /scrun.sh

ENTRYPOINT /scrun.sh $USER_NAME $API_KEY \
           && nginx -g 'daemon off;' \
           && /bin/bash
