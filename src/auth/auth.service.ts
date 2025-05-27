import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import {
  USER_NOT_EXIST_MESSAGE,
  WRONG_PASSWORD_MASSAGE,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    return this.userModel.create({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string) {
    const foundUser = await this.findUser(email);
    if (!foundUser) {
      throw new UnauthorizedException(USER_NOT_EXIST_MESSAGE);
    }
    const isPasswordOk = await compare(password, foundUser.passwordHash);
    if (!isPasswordOk) {
      throw new UnauthorizedException(WRONG_PASSWORD_MASSAGE);
    }
    return { email: foundUser.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
