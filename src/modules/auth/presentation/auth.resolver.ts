import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthAddPassword, AuthLoginInput, AuthSignUpInput } from '@modules/auth/presentation';
import { AuthCookieService, AuthService } from '@modules/auth/services';
import { Auth } from '@modules/auth/presentation';
import { FastifyRequest, type FastifyReply } from 'fastify';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@common';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
  ) {}

  @Mutation(() => Auth)
  async login(
    @Args('input', { type: () => AuthLoginInput }) authLoginInput: AuthLoginInput,
    @Context() context: { res: FastifyReply },
  ) {
    const response = await this.authService.login(authLoginInput);
    this.authCookieService.setTokens(response.tokens, context.res);
    return response;
  }

  @Mutation(() => Auth)
  async signUp(
    @Args('input', { type: () => AuthSignUpInput }) authSignUpInput: AuthSignUpInput,
    @Context() context: { res: FastifyReply },
  ) {
    const response = await this.authService.signUp(authSignUpInput);
    this.authCookieService.setTokens(response.tokens, context.res);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async logOut(
    @Context() context: { req: FastifyRequest & { user: { id: string } }; res: FastifyReply },
  ) {
    await this.authService.logOut({ userId: context.req.user.id });
    this.authCookieService.clearTokens(context.res);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Auth)
  async refresh(
    @Context() context: { req: FastifyRequest & { user: { id: string } }; res: FastifyReply },
  ) {
    if (!context.req.cookies?.refresh_token)
      throw new UnauthorizedException('refresh_token not found');
    const response = await this.authService.refreshTokens({
      refresh_token: context.req.cookies?.refresh_token,
      user: context.req.user,
    });
    this.authCookieService.setTokens(response.tokens, context.res);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async addPassword(
    @Args('input', { type: () => AuthAddPassword })
    authAddPasswordInput: AuthAddPassword,
    @Context() context: { req: FastifyRequest & { user: { email: string } } },
  ) {
    await this.authService.addPassword({
      email: context.req.user.email,
      newPassword: authAddPasswordInput.newPassword,
      oldPassword: authAddPasswordInput.oldPassword,
    });
    return true;
  }
}
