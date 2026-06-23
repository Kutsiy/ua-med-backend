import { Module } from '@nestjs/common';
import { AuthResolver } from '@modules/auth/presentation';
import { UsersModule } from '@modules/user';
import { PassportModule } from '@nestjs/passport';

import { JWT_STRATEGY } from '@modules/auth/domain';
import { JwtStrategy } from '@modules/auth/infrastructure';
import { AuthService } from '@modules/auth/services';

@Module({
  imports: [AuthResolver, PassportModule, UsersModule],
  providers: [
    {
      provide: JWT_STRATEGY,
      useClass: JwtStrategy,
    },
    AuthService,
  ],
})
export class AuthModule {}
