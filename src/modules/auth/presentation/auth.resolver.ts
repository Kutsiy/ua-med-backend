import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthLoginInput, AuthSignUpInput } from '@modules/auth/presentation';
import { AuthService } from '@modules/auth/services';
import { Auth } from '@modules/auth/presentation';
import { Token } from '@common/models';
import { type FastifyReply } from 'fastify';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  private setTokens(tokens: Token, response: FastifyReply) {
    response.setCookie('access_token', tokens.access_token);
    response.setCookie('refresh_token', tokens.refresh_token);
  }

  @Mutation(() => Auth)
  async login(
    @Args('authLoginInput', { type: () => AuthLoginInput }) authLoginInput: AuthLoginInput,
    @Context('res') response: FastifyReply,
  ) {
    const res = await this.authService.login(authLoginInput);
    this.setTokens(res.tokens, response);
    return res;
  }

  @Mutation(() => Auth)
  async signUp(
    @Args('authSignUpInput', { type: () => AuthSignUpInput }) authSignUpInput: AuthSignUpInput,
    @Context('res') response: FastifyReply,
  ) {
    const res = await this.authService.signUp(authSignUpInput);
    this.setTokens(res.tokens, response);
    return res;
  }

  // @Mutation(() => Auth)
  // async logOut() {}
  // @Mutation(() => Auth)
  // async refresh() {}
}
