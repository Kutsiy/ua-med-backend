import {
  BadRequestException,
  Catch,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { Prisma } from '../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaGraphqlExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(PrismaGraphqlExceptionFilter.name);
  catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          throw new ConflictException('Resource already exists');
        case 'P2003':
          throw new BadRequestException('Related resource not found');
        case 'P2025':
          throw new NotFoundException('Resource not found');
        default:
          this.logger.error(`Prisma error ${exception.code}`, exception.message);
          throw new InternalServerErrorException('Database operation failed');
      }
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      this.logger.error(`Prisma validation error`, exception.message);
      throw new BadRequestException('Invalid data provided');
    }
  }
}
