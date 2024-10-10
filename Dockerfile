FROM node:14-alpine

RUN apk add --no-cache tzdata

ENV TZ Asia/Shanghai

WORKDIR /app

COPY ./package.json ./package.json

COPY ./yarn.lock ./yarn.lock

COPY ./.env ./.env

RUN yarn

COPY . .

CMD ["yarn", "start"]
