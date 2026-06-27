import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '@app/app.module';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  it('nothing', () => {
    expect(null).toBe(null);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
