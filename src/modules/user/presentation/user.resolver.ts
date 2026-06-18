import { Resolver, Query } from '@nestjs/graphql';
import { User } from './models/user.model';

@Resolver(() => User)
export class UsersResolver {
  @Query(() => String)
  health(): string {
    return 'ok';
  }
}
