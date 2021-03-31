global.APP_PATH = __dirname;

import path from 'path';
import Octo from '@octo-bot/core';
import TomonBot from '@octo-bot/tomon-bot';
import DiscordBot from '@octo-bot/discord-bot';
import TelegramBot from '@octo-bot/telegram-bot';

const ROOT = path.resolve(__dirname);

const tomonBot = new TomonBot(ROOT, 'tomon');
const telegramBot = new TelegramBot(ROOT, 'telegram', {
  handlerTimeout: 10000,
});
const discordBot = new DiscordBot(ROOT, 'discord');

const instance = Octo.getInstance({
  bots: [tomonBot, telegramBot, discordBot],
  ROOT,
});

instance.start();
