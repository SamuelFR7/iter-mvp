import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/database/prisma/prisma.service';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';

@Injectable()
class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<User> {
    const newUser = await this.prisma.user.create({
      data,
    });

    return newUser;
  }

  findByEmail(email: string): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}

export { UserRepository };
