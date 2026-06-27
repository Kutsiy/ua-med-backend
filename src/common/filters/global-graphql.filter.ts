import { Catch, HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class GlobalGraphqlExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GlobalGraphqlExceptionFilter.name);

  catch(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception;
    }

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(`Unknown exception: ${String(exception)}`);
    }

    return new InternalServerErrorException('Internal server error');
  }
}
