import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@common/generated/prisma/client';

const logger = new Logger('PrismaErrorHandler');

export function handlePrismaError(error: unknown, context?: string): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const suffix = context ? ` (${context})` : '';

    switch (error.code) {
      case 'P2002':
        throw new ConflictException('Resource already exists');
      case 'P2003':
        throw new BadRequestException('Related resource not found');
      case 'P2025':
        throw new NotFoundException('Resource not found');
      default:
        logger.error(`Prisma error ${error.code}${suffix}`, error.message);
        throw new InternalServerErrorException('Database operation failed');
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error(`Prisma validation error${context ? ` (${context})` : ''}`, error.message);
    throw new BadRequestException('Invalid data provided');
  }

  throw error;
}

export async function withPrismaErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    handlePrismaError(error, context);
  }
}
