import { Module } from '@nestjs/common';
import { AuthResolver, AuthController } from '@modules/auth/presentation';
import { UsersModule } from '@modules/user';
import { PassportModule } from '@nestjs/passport';
import {
  JwtStrategy,
  OAuthAccountRepository,
  OAuthStrategy,
  RefreshTokenRepository,
} from '@modules/auth/infrastructure';
import {
  AuthCookieService,
  AuthRefreshTokenService,
  AuthService,
  OAuthService,
} from '@modules/auth/services';
import { PrismaModule, TokenModule } from '@common/services';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from '@common/config/google-oauth.config';
import { OAUTH_ACCOUNT_REPO, REFRESH_TOKEN_REPO } from '@modules/auth/domain';

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
    AuthRefreshTokenService,
    { provide: REFRESH_TOKEN_REPO, useClass: RefreshTokenRepository },
    { provide: OAUTH_ACCOUNT_REPO, useClass: OAuthAccountRepository },
    OAuthService,
  ],
})
export class AuthModule {}
