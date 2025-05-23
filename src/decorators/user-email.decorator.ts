import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserModel } from '../auth/schemas/user.schema';

export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (request.user as Pick<UserModel, 'email'>).email;
  },
);
