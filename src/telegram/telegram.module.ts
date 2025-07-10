import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramModuleAsyncOptions } from './types';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';

@Global()
@Module({})
export class TelegramModule {
  static forRooAsync(options: TelegramModuleAsyncOptions): DynamicModule {
    const asyncOptions = TelegramModule.createAsyncOptionsProvider(options);
    return {
      module: TelegramModule,
      imports: options.imports,
      providers: [TelegramService, asyncOptions],
      exports: [TelegramService],
    };
  }

  private static createAsyncOptionsProvider(
    options: TelegramModuleAsyncOptions,
  ): Provider {
    return {
      provide: TELEGRAM_MODULE_OPTIONS,
      useFactory: async (...args: any[]) => {
        return options.useFactory(...args);
      },
      inject: options.inject || [],
    };
  }
}
