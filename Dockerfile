FROM node:16 AS builder

WORKDIR /usr/src/api

ARG DB_URL='fake-db-url'
ARG S3_BUCKET='fake-s3-bucket'
ARG S3_ACCESS_KEY_ID='fake-s3-access-key-id'
ARG S3_SECRET_ACCESS_KEY='fake-s3-secret-access-key'
ARG API_ENDPOINT='fake-api-endpoint'
ARG VUE_ENDPOINT='fake-vue-endpoint'
ARG MAILGUN_KEY='fake-mail-fun'
ARG MAILGUN_DOMAIN='fake-mail-fun'
ARG MAILGUN_HOST='fake-mail-fun'
ARG ELASTICSEARCH_NODE='http://host:9200'
ARG ELASTICSEARCH_USERNAME='emptpy for no username'
ARG ELASTICSEARCH_PASSWORD='same for the password'
ARG GOOGLE_AUTH_TOKEN_URI="https://oauth2.googleapis.com/token"
ARG GOOGLE_AUTH_CLIENT_CERT_URL=""
ARG GOOGLE_AUTH_PRIVATE_KEY_ID=""
ARG GOOGLE_AUTH_PROJECT_ID=""
ARG GOOGLE_AUTH_CLIENT_ID=""
ARG GOOGLE_AUTH_AUTH_PROVIDER_CERT_URL=""
ARG GOOGLE_AUTH_CLIENT_EMAIL=""
ARG GOOGLE_AUTH_AUTH_URI=""
ARG GOOGLE_AUTH_PRIVATE_KEY=""
ARG GOOGLE_AUTH_TYPE=""
ARG AUTH_API_KEY=""

# Build api first
COPY api/package.json api/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY api/. ./

RUN yarn run build

RUN yarn run generate-schema

# Build webapp
ARG GITDATE
ARG GITBRANCH
ARG GITDESCRIBE

WORKDIR /usr/src/app

COPY app/package.json app/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY app/. ./

RUN yarn run lint

RUN yarn run codegen:pipeline

RUN yarn run build

# serve webapp
FROM nginx

EXPOSE 8080

WORKDIR /var/www/html

COPY app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/ .