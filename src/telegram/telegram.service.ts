import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TelegramOptions } from './types';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: TelegramOptions;

  constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: TelegramOptions) {
    console.log('options', options);
    this.bot = new Telegraf(options.token);
    this.options = options;
  }

  async sendMessage(message: string) {
    console.log('this.options.chatId', this.options.chatId);
    await this.bot.telegram.sendMessage(this.options.chatId, message);
  }
}
