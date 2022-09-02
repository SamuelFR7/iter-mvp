import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserService } from './createUser.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller()
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('users')
  async handle(
    @Body()
    userData: {
      name: string;
      email: string;
      password: string;
      address: string;
      country: string;
      phone: string;
    },
  ): Promise<User> {
    const { name, email, password, address, country, phone } = userData;
    return this.createUserService.execute({
      name: name.toUpperCase(),
      email: email.toLowerCase(),
      password,
      address,
      country,
      phone,
    });
  }
}
