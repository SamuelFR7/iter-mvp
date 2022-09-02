import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { User } from '../../entities/User';
import { UserRepository } from '../../infra/prisma/UserRepository';

@Injectable()
export class CreateUserService {
  constructor(private usersRepository: UserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const { email, password, address, country, name, phone } = data;

    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await hash(password, 8);

    return this.usersRepository.create({
      password: passwordHash,
      address,
      country,
      email,
      name,
      phone,
    });
  }
}
