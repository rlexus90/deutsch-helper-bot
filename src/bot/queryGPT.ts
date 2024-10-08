import { IAntwort, Imsg } from '../types';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { TEXT } from '../const';

dotenv.config();

const GPT_KEY = process.env.GPT_KEY || '';

const openai = new OpenAI({ apiKey: GPT_KEY });

export const queryGPT = async (msg: Imsg): Promise<IAntwort> => {
  const {
    text,
    chat: { id },
  } = msg;

  console.log('Basic function');

  try {
    if (text.split(' ').length > 1) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          { role: 'system', content: TEXT.QUERY_SATZ },
          {
            role: 'user',
            content: `${text}`,
          },
        ],
      });

      const antwort = completion.choices[0].message.content as string;
      console.log(completion.choices[0].message.content);
      return {
        chatId: id,
        text: antwort,
      };
    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini-2024-07-18',
        messages: [
          { role: 'system', content: TEXT.SYSTEM_QUERY },
          {
            role: 'user',
            content: `${text} ${TEXT.QUERY}`,
          },
        ],
      });

      const antwort = completion.choices[0].message.content as string;
      console.log(completion.choices[0].message.content);
      return {
        chatId: id,
        text: antwort,
      };
    }
  } catch (e) {
    console.log(e);
  }

  return {
    chatId: id,
    text: TEXT.ERROR,
  };
};
