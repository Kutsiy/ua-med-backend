import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useLogger(app.get(Logger));

  await app.register(fastifyCookie, {
    secret: process.env.SECRET,
  });

  app.enableCors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Backend')
    .setDescription('Backend api documentation')
    .setVersion('1.0')
    .addTag('Auth', 'all endpoints which related to auth')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      autoTagControllers: false,
    });
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
