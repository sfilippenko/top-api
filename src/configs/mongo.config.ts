import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const getMongoConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => {
  return {
    uri: `mongodb://${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DATABASE_NAME')}`,
    user: configService.get('MONGO_USERNAME'),
    pass: configService.get('MONGO_PASSWORD'),
    authSource: 'admin',
  };
};
