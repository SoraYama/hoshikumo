FROM node:12-alpine

RUN apk add --no-cache tzdata

ENV TZ Asia/Shanghai

WORKDIR /app

COPY ./package.json ./package.json

COPY ./yarn.lock ./yarn.lock

RUN yarn --registry=https://registry.npm.taobao.org

COPY . .

CMD ["yarn", "start"]
