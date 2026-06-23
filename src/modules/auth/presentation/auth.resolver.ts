import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthLoginInput } from '@modules/auth/presentation';
import { AuthService } from '@modules/auth/services';
import { Auth } from '@modules/auth/presentation';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async login(
    @Args('authLoginInput', { type: () => AuthLoginInput }) authLoginInput: AuthLoginInput,
  ) {
    return await this.authService.login(authLoginInput);
  }

  @Mutation(() => Auth)
  async signUp() {}

  // @Mutation(() => Auth)
  // async logOut() {}
  // @Mutation(() => Auth)
  // async refresh() {}
}
