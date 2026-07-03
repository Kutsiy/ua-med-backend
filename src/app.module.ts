import { Module } from '@nestjs/common';
import { LoggerModule, nativeLoggerOptions } from 'nestjs-pino';
import { Response, Request } from 'express';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from '@modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalGraphqlExceptionFilter, PrismaGraphqlExceptionFilter } from '@common/filters';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '@common';
import { GraphQLFormattedError } from 'graphql';

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
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory() {
        return {
          autoSchemaFile: join(process.cwd(), 'src/common/generated/graphql/schema.gql'),
          sortSchema: true,
          playground: true,
          context: (req: FastifyRequest, reply: FastifyReply) => {
            return {
              req,
              res: reply,
            };
          },
          formatError: (error): GraphQLFormattedError => {
            const originalError = error.extensions?.originalError;
            console.log(originalError);
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
              extensions: {
                statusCode,
                code: error.extensions?.code,
              },
            };
          },
        };
      },
    }),
    AuthModule,
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
    JwtAuthGuard,
  ],
})
export class AppModule {}
