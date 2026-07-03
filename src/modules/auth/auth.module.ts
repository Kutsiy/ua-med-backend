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
  AuthOtherService,
  AuthCookieService,
  AuthRefreshTokenService,
  AuthService,
  OAuthService,
} from '@modules/auth/services';
import { PrismaModule, TokenModule, MailModule, HashModule } from '@common/services';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from '@common/config/google-oauth.config';
import { OAUTH_ACCOUNT_REPO, REFRESH_TOKEN_REPO } from '@modules/auth/domain';
import { AccessControlModule } from '../access-control';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    AccessControlModule,
    TokenModule,
    ConfigModule.forFeature(googleOauthConfig),
    PrismaModule,
    MailModule,
    HashModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthResolver,
    JwtStrategy,
    AuthService,
    OAuthStrategy,
    AuthCookieService,
    AuthRefreshTokenService,
    AuthOtherService,
    { provide: REFRESH_TOKEN_REPO, useClass: RefreshTokenRepository },
    { provide: OAUTH_ACCOUNT_REPO, useClass: OAuthAccountRepository },
    OAuthService,
  ],
})
export class AuthModule {}
