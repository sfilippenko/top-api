import {
  Controller,
  Post,
  HttpCode,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { USER_EXIST_MESSAGE, USER_NOT_EXIST_MESSAGE } from './auth.constants';
import { JwtGuard } from './guards/jwt.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(USER_EXIST_MESSAGE);
    }
    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto.login, dto.password);
    return this.authService.login(user.email);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deleted = await this.authService.deleteUser(id);
    if (!deleted) {
      throw new HttpException(USER_NOT_EXIST_MESSAGE, HttpStatus.NOT_FOUND);
    }

    return deleted;
  }
}
