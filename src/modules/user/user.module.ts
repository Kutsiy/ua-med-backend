import { Module } from '@nestjs/common';
import { UsersResolver } from './presentation/user.resolver';
import { PrismaModule } from '@common/services';
import { UserRepository } from './infrastructure';
import { UserService } from './services/user.service';
import { USER_REPO } from './domain';

@Module({
  imports: [PrismaModule],
  providers: [UsersResolver, { provide: USER_REPO, useClass: UserRepository }, UserService],
  exports: [UserService],
})
export class UsersModule {}
