import { Module } from '@nestjs/common';
import { AuthResolver, AuthController } from '@modules/auth/presentation';
import { UsersModule } from '@modules/user';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, OAuthStrategy } from '@modules/auth/infrastructure';
import { AuthService } from '@modules/auth/services';
import { PrismaModule, TokenModule } from '@common/services';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from '@common/config/google-oauth.config';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    TokenModule,
    ConfigModule.forFeature(googleOauthConfig),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthResolver, JwtStrategy, AuthService, OAuthStrategy],
})
export class AuthModule {}
