import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { EnsureAuthenticate } from './infra/http/middlewares/ensureAuthenticate.middleware';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticate)
      .forRoutes({ path: 'api', method: RequestMethod.ALL });
  }
}
