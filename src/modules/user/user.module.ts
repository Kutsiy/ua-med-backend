import { Module } from '@nestjs/common';
import { UserResolver } from './presentation/user.resolver';
import { PrismaModule } from '@common/services';
import { UserRepository } from './infrastructure';
import { UserService } from './services/user.service';
import { USER_REPO } from './domain';
import { AccessControlModule } from '../access-control/access-control.module';

@Module({
  imports: [PrismaModule, AccessControlModule],
  providers: [UserResolver, { provide: USER_REPO, useClass: UserRepository }, UserService],
  exports: [UserService],
})
export class UsersModule {}
