FROM alpine:latest
RUN apk add --update nginx && rm -rf /var/cache/apk/*
RUN mkdir -p /tmp/nginx/client-body

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html/
COPY src/index.html /usr/share/nginx/html/index.html
COPY src/pipeline.scss /usr/share/nginx/html/pipeline.scss
COPY src/app.js /usr/share/nginx/html/app.js

CMD ["nginx", "-g", "daemon off;"]
