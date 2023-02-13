global.APP_PATH = __dirname;

import dotenv from 'dotenv';
import path from 'path';

import Octo from '@octo-bot/core';
// import DiscordBot from '@octo-bot/discord-bot';
import TelegramBot from '@octo-bot/telegram-bot';

const { REDIS_HOST, REDIS_PORT, REDIS_DB } = dotenv.config().parsed || {};

const ROOT = path.resolve(__dirname);

// const telegramBot = new TelegramBot(ROOT, 'telegram', {
//   handlerTimeout: 10000,
// });
// const discordBot = new DiscordBot(ROOT, 'discord');

const telegramBot = new TelegramBot(ROOT, 'telegram', {
  handlerTimeout: 10000,
});
const instance = Octo.getInstance({
  bots: [telegramBot],
  ROOT,
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    database: REDIS_DB,
  },
});

instance.start();
