import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { genSaltSync, hash, hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = genSaltSync(10);
    return this.userModel.create({
      email: dto.login,
      passwordHash: hashSync(dto.password, salt),
    });
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
