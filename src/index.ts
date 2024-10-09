global.APP_PATH = __dirname;

import dotenv from 'dotenv';
import path from 'path';
import Octo from '@octo-bot/core';
import QQBot from '@octo-bot/qq-bot';
import { AvailableIntentsEventsEnum } from 'qq-guild-bot';

const { REDIS_HOST, REDIS_PORT, REDIS_DB, QQ_BOT_TOKEN, QQ_APP_ID } = dotenv.config().parsed || {};

const ROOT = path.resolve(__dirname);

const qqBot = new QQBot(ROOT, 'qq', {
  appID: QQ_APP_ID,
  token: QQ_BOT_TOKEN,
  intents: [
    AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES,
    AvailableIntentsEventsEnum.DIRECT_MESSAGE,
    AvailableIntentsEventsEnum.INTERACTION,
  ],
  sandbox: true,
});

const instance = Octo.getInstance({
  bots: [qqBot],
  ROOT,
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    database: REDIS_DB,
    // password: REDIS_PASSWORD,
  },
});

instance.start();
