import { Body, Controller, Post } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserAuthResponse, UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body()
    userData: {
      name: string;
      email: string;
      password: string;
      address: string;
      country: string;
      phone: string;
    },
  ): Promise<UserModel> {
    const { name, email, password, address, country, phone } = userData;
    return this.userService.createUser({
      name: name.toUpperCase(),
      email: email.toLowerCase(),
      password,
      address,
      country,
      phone,
    });
  }

  @Post('auth')
  async authUser(
    @Body() userData: { email: string; password: string },
  ): Promise<UserAuthResponse> {
    return this.userService.authUser(userData);
  }
}
