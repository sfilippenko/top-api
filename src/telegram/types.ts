import { ModuleMetadata } from '@nestjs/common';

export interface TelegramOptions {
  chatId: string;
  token: string;
}

export interface TelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<TelegramOptions> | TelegramOptions;
}
