import { Module } from '@nestjs/common';
import { LoggerModule, nativeLoggerOptions } from 'nestjs-pino';
import { Response, Request } from 'express';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/user/user.module';
import { APP_FILTER } from '@nestjs/core';
import {
  GlobalGraphqlExceptionFilter,
  GlobalHttpExceptionFilter,
  PrismaGraphqlExceptionFilter,
} from '@common/filters';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '@common';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers["set-cookie"]',
          'res.headers["set-cookie"]',
          'password',
          'accessToken',
          'refreshToken',
        ],
        serializers: {
          req(req: Request) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
            };
          },
          res(res: Response) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                },
              }
            : undefined,
      },
      ...nativeLoggerOptions,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      useFactory() {
        return {
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'src/common/generated/graphql/schema.gql'),
          sortSchema: true,
          playground: true,
          context: (req: FastifyRequest, reply: FastifyReply) => {
            return {
              req,
              res: reply,
            };
          },
          formatError: (error) => {
            const originalError = error.extensions?.originalError;

            let message = error.message;
            let statusCode: number | undefined;

            if (originalError && typeof originalError === 'object' && 'message' in originalError) {
              const originalMessage = originalError.message;

              if (typeof originalMessage === 'string') {
                message = originalMessage;
              }

              if (Array.isArray(originalMessage)) {
                message = originalMessage.join(', ');
              }
            }

            if (
              originalError &&
              typeof originalError === 'object' &&
              'statusCode' in originalError &&
              typeof originalError.statusCode === 'number'
            ) {
              statusCode = originalError.statusCode;
            }

            return {
              message,
              code: error.extensions?.code,
              statusCode,
            };
          },
        };
      },
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaGraphqlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalGraphqlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
    JwtAuthGuard,
  ],
})
export class AppModule {}
