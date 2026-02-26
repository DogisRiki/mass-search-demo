FROM node:24-alpine

RUN apk add --no-cache git
RUN npm install -g pnpm

USER node
WORKDIR /home/node/app

RUN mkdir node_modules
