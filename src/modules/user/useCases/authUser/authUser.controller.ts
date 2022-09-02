import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserService, UserAuthResponse } from './authUser.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller()
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Post('users/auth')
  async handle(
    @Body() userData: { email: string; password: string },
  ): Promise<UserAuthResponse> {
    return this.authUserService.execute(userData);
  }
}
