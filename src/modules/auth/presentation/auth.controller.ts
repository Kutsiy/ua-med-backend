import { GoogleOAuthGuard } from '@common';
import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthOtherService, AuthCookieService, OAuthService } from '@modules/auth/services';
import { ChangePasswordInput, ForgotPasswordInput } from './inputs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly oAuthService: OAuthService,
    private readonly authCookieService: AuthCookieService,
    private readonly authOtherService: AuthOtherService,
  ) {}

  @Get('activate')
  async activateAccount(@Query('link') link: string, @Res() res: FastifyReply) {
    await this.authOtherService.activateAccountByLink(link);
    res.code(302).header('Location', this.configService.getOrThrow('REDIRECT_URL')).send();
  }

  @Post('password/forgot')
  async forgotPassword(@Body() forgotPasswordInput: ForgotPasswordInput) {
    console.log(1);
    await this.authOtherService.forgotPassword(forgotPasswordInput.email);
    return {
      success: true,
      message: 'If this email exists, password reset email was sent',
    };
  }

  @Post('password/reset')
  async changePassword(@Body() changePasswordInput: ChangePasswordInput) {
    await this.authOtherService.changePassword(
      changePasswordInput.newPass,
      changePasswordInput.passLink,
    );
    return {
      success: true,
    };
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Req() req: FastifyRequest & { user: { id: string } },
    @Res() res: FastifyReply,
  ) {
    const response = await this.oAuthService.getOAuthUser(req.user.id);
    this.authCookieService.setTokens(response.tokens, res);
    return res.code(302).header('Location', this.configService.getOrThrow('REDIRECT_URL')).send();
  }
}
