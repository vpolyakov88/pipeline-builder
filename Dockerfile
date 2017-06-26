FROM alpine:3.6

RUN apk add --update nginx

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html/
COPY src/index.html /usr/share/nginx/html/index.html
COPY src/pipeline.scss /usr/share/nginx/html/pipeline.scss
COPY src/app.js /usr/share/nginx/html/app.js

ENTRYPOINT ["nginx", "-g", "daemon off;"]

