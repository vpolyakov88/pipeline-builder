FROM alpine:3.6

ARG USER_NAME=unknown
ARG API_KEY=unknown

RUN apk add --update nginx wget openjdk8-jre

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html/
COPY src/index.html /usr/share/nginx/html/index.html
COPY src/pipeline.scss /usr/share/nginx/html/pipeline.scss
COPY src/app.js /usr/share/nginx/html/app.js

RUN mkdir -p /usr/local/sauce-connect && \
	wget --no-check-certificate -P /usr/local/sauce-connect https://saucelabs.com/downloads/sc-4.4.7-linux.tar.gz -O - | tar -xz
RUN nginx -g daemon off
ENTRYPOINT ["/usr/local/sauce-connect/sc-4.4.7-linux/bin/sc", "--user=$USER_NAME", "--api-key=$API_KEY"]
