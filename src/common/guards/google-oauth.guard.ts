import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleOAuthGuard.name);

  getRequest(context: ExecutionContext): FastifyRequest {
    return context.switchToHttp().getRequest<FastifyRequest>();
  }

  getResponse(context: ExecutionContext) {
    const reply = context.switchToHttp().getResponse<FastifyReply>();
    return reply.raw;
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err) {
      this.logger.warn('Google OAuth authentication failed', err.message);
      throw err;
    }

    if (!user) {
      this.logger.warn('Google OAuth authentication failed: user not found');
      throw new UnauthorizedException();
    }

    return user;
  }
}
