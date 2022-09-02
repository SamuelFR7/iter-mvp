import { HttpException, HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

interface IPayload {
  sub: string;
}

export class EnsureAuthenticate implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }

    const [, token] = authHeader.split(' ');

    try {
      const { sub: user_id } = verify(
        token,
        process.env.JWT_SECRET,
      ) as IPayload;

      const prismaService = new PrismaService();

      const user = prismaService.user.findUnique({ where: { id: user_id } });

      if (!user) {
        throw new HttpException(
          'User does not exists',
          HttpStatus.UNAUTHORIZED,
        );
      }

      req.user = {
        id: user_id,
      };

      next();
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
