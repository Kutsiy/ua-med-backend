// eslint-disable-next-line no-restricted-imports
import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [AuthResolver],
})
export class AuthModule {}
