import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { PrismaService } from '../../../../infra/database/prisma/prisma.service';

@Injectable()
export class CreateUserService {
  constructor(private prisma: PrismaService) {}

  async execute(data: Prisma.UserCreateInput): Promise<User> {
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
}
