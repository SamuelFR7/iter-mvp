import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UserRepository } from '../../infra/prisma/UserRepository';

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
  constructor(private usersRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: UserAuthRequest): Promise<UserAuthResponse> {
    const user = await this.usersRepository.findByEmail(email);

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
