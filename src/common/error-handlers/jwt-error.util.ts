import {
  HttpException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

const logger = new Logger('JwtErrorHandler');

const JWT_ERROR_NAMES = new Set(['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError']);

export function handleJwtError(error: unknown, context?: string): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof Error && JWT_ERROR_NAMES.has(error.name)) {
    logger.warn(`JWT validation failed${context ? ` (${context})` : ''}: ${error.name}`);
    throw new UnauthorizedException();
  }

  logger.error(
    `JWT operation failed${context ? ` (${context})` : ''}`,
    error instanceof Error ? error.stack : String(error),
  );
  throw new InternalServerErrorException('Token operation failed');
}
