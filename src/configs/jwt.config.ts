import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export const getJwtModuleOptions = (
  configService: ConfigService,
): JwtModuleOptions => {
  return {
    secret: configService.get('JWT_SECRET'),
  };
};
