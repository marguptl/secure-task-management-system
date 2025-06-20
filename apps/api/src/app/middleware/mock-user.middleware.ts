import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req['user'] = {
      id: 'mock-user-id',
      role: 'user', // or 'admin'
    };
    next();
  }
}
