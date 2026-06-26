import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  getRequest(context: ExecutionContext): FastifyRequest {
    return context.switchToHttp().getRequest<FastifyRequest>();
  }

  getResponse(context: ExecutionContext) {
    const reply = context.switchToHttp().getResponse<FastifyReply>();
    return reply.raw;
  }
}
