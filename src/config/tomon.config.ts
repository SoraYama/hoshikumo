import dotenv from 'dotenv';

const botToken = dotenv.config().parsed?.TOMON_TOKEN || '';

export default {
  botToken,
  superUserIds: [],
  bannedModules: [],
  enabledGroupIds: null,
  blockedUser: [],
};
