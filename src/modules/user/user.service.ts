import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface UserAuthRequest {
  email: string;
  password: string;
}

export interface UserAuthResponse {
  user: {
    email: string;
  };
  token: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const { email, password, address, country, name, phone } = data;

    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await hash(password, 8);

    return this.prisma.user.create({
      data: {
        password: passwordHash,
        address,
        country,
        email,
        name,
        phone,
      },
    });
  }

  async authUser({
    email,
    password,
  }: UserAuthRequest): Promise<UserAuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        'Username or password incorrect!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpException(
        'Username or password incorrect!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '1d',
    });

    const tokenReturn: UserAuthResponse = {
      token,
      user: {
        email: user.email,
      },
    };

    return tokenReturn;
  }
}
