import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

import { BaseModule, Trigger, TriggerMethod } from '@octo-bot/core';

const parsedConfig = dotenv.config().parsed;
const openAIConfig = new Configuration({
  apiKey: parsedConfig?.OPEN_AI_TOKEN,
});
const openAI = new OpenAIApi(openAIConfig);

@Trigger('/chat')
class ChatGPTModule extends BaseModule {
  @Trigger({ match: 'ask', methods: [TriggerMethod.Prefix] })
  public async ask() {
    const prompt = this.event.params[0];

    const response = await openAI.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.9, // 每次返回的答案的相似度0-1（0：每次都一样，1：每次都不一样）
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [' Human:', ' AI:'],
    });

    const content = response.data.choices?.[0].text;
    this.event.reply({
      content,
    });
  }
}

export default ChatGPTModule;
