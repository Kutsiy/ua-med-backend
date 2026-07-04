import { User } from '@modules/user';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Account } from './models';
import { Logger } from '@nestjs/common';
import { OAuthService } from '../services';

@Resolver(() => User)
export class UserAccountResolver {
  private readonly logger = new Logger(UserAccountResolver.name);

  constructor(private readonly accountService: OAuthService) {}

  @ResolveField('accounts', () => [Account])
  async getAllAccountsByUserId(@Parent() user: User) {
    this.logger.log(`Find all account for user, userId=${user.id}`);

    return await this.accountService.getAllAccountsByUserId(user.id);
  }
}
