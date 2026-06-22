import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class GlobalHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown) {
    // const gqlHost = GqlArgumentsHost.create(host);
    // const ctx = gqlHost.switchToHttp();
    // const response = ctx.getResponse<FastifyReply>();
    // const request = ctx.getRequest<FastifyRequest>();
    // const status =
    //   exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // const message =
    //   exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    // response.status(status).send({
    //   success: false,
    //   statusCode: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   message,
    // });
    return exception;
  }
}
