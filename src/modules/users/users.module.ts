import { Module } from '@nestjs/common';
import { UsersResolver } from './presentation/users.resolver';

@Module({
  providers: [UsersResolver],
})
export class UsersModule {}
