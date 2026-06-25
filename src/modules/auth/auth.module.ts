import { Module } from '@nestjs/common';
import { AuthResolver, AuthController } from '@modules/auth/presentation';
import { UsersModule } from '@modules/user';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, OAuthAccountRepository, OAuthStrategy } from '@modules/auth/infrastructure';
import { AuthCookieService, AuthService, OAuthService } from '@modules/auth/services';
import { PrismaModule, TokenModule } from '@common/services';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from '@common/config/google-oauth.config';
import { OAUTH_ACCOUNT_REPO } from '@modules/auth/domain';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    TokenModule,
    ConfigModule.forFeature(googleOauthConfig),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthResolver,
    JwtStrategy,
    AuthService,
    OAuthStrategy,
    AuthCookieService,
    { provide: OAUTH_ACCOUNT_REPO, useClass: OAuthAccountRepository },
    OAuthService,
  ],
})
export class AuthModule {}
