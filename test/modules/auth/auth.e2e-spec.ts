import { AppModule } from '@app/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

type GraphQLErrorResponse = {
  errors: Array<{
    message: string;
    extensions: {
      code: string;
      statusCode: number;
    };
  }>;
  data: null;
};

describe('AuthModule', () => {
  let app: NestFastifyApplication;
  const grapqlLink = '/graphql';

  beforeEach(async () => {
    const authModuleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = authModuleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe('Auth resolver', () => {
    it('refresh token', () => {
      const query = `
    mutation Refresh {
        refresh {
            tokens {
                access_token
                refresh_token
            }
        }
    }
    `;

      return app
        .inject({
          method: 'POST',
          url: grapqlLink,
          payload: { query },
        })
        .then((result) => {
          expect(result.statusCode).toBe(200);
          const body = result.json<GraphQLErrorResponse>();
          const error = body.errors[0];
          expect(error.message).toBe('Unauthorized');
          expect(error.extensions.code).toBe('UNAUTHENTICATED');
        });
    });
  });
});
