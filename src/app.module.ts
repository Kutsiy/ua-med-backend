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
import { GlobalHttpExceptionFilter } from '@common/filters';
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
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
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
    JwtAuthGuard,
  ],
})
export class AppModule {}
