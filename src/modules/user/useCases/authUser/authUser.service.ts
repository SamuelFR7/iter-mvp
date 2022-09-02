import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../../../../infra/database/prisma/prisma.service';

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
export class AuthUserService {
  constructor(private prisma: PrismaService) {}

  async execute({
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
