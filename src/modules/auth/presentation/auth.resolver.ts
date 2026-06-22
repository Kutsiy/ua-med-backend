import { Resolver, Mutation } from '@nestjs/graphql';
import { User } from '@modules/user';

@Resolver(() => User)
export class AuthResolver {
  @Mutation(() => User)
  async login() {}
  @Mutation(() => User)
  async signUp() {}
  @Mutation(() => User)
  async logOut() {}
  @Mutation(() => User)
  async refresh() {}
}
