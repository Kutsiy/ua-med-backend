import { Module } from '@nestjs/common';
import { UsersResolver } from './presentation/user.resolver';

@Module({
  providers: [UsersResolver],
})
export class UsersModule {}
