import { TelegramOptions } from '../telegram/types';
import { ConfigService } from '@nestjs/config';

export const getTelegramConfig = (
  configService: ConfigService,
): TelegramOptions => {
  return {
    chatId: configService.get('TELEGRAM_ID') || '',
    token: configService.get('TELEGRAM_TOKEN') || '',
  };
};
