import { Module } from '@nestjs/common';
import { UsersResolver } from './presentation/user.resolver';
import { PrismaModule } from '@common/services';

@Module({
  imports: [PrismaModule],
  providers: [UsersResolver],
})
export class UsersModule {}
