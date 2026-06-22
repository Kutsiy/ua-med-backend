// import { AuthenticationError } from '@nestjs/apollo';
import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  protected readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<{ req: FastifyRequest }>();
    console.log(req);
    return super.canActivate(new ExecutionContextHost([req]));
  }

  //   handleRequest(err: Error, user: any): any {
  //     if (err) {
  //       this.logger.error(`Auth Error! ${err?.message}`);
  //       throw err;
  //     }

  //     if (!user) {
  //       this.logger.error('Auth Error! User not found');
  //       throw new AuthenticationError('Auth Error! User not found');
  //     }

  //     return user;
  //   }
}
