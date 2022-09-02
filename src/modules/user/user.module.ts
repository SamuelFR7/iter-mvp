import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { AuthUserController } from './useCases/authUser/authUser.controller';
import { AuthUserService } from './useCases/authUser/authUser.service';
import { CreateUserController } from './useCases/createUser/createUser.controller';
import { CreateUserService } from './useCases/createUser/createUser.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthUserController, CreateUserController],
  providers: [AuthUserService, CreateUserService],
})
export class UserModule {}
