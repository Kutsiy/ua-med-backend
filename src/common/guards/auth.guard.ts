import { Injectable, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  getRequest(context: ExecutionContext): FastifyRequest {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: FastifyRequest }>().req;
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err) {
      this.logger.warn('JWT authentication failed', err.message);
      throw err;
    }

    if (!user) {
      this.logger.warn('JWT authentication failed: user not found in request');
      throw new UnauthorizedException();
    }

    return user;
  }
}
