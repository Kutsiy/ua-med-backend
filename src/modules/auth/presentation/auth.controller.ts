import { GoogleOAuthGuard } from '@common';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthCookieService, OAuthService } from '@modules/auth/services';
import { MailService } from '@common/services';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly oAuthService: OAuthService,
    private readonly authCookieService: AuthCookieService,
    private readonly mailService: MailService,
  ) {}

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
    console.log(response.tokens);
    return res.code(302).header('Location', this.configService.getOrThrow('REDIRECT_URL')).send();
  }

  @Get('health')
  async health() {
    await this.mailService.sendActivationEmail({
      email: 'kycuj.egor2020@gmail.com',
      activationLink: 'some-link',
      userName: 'Egor',
    });
  }
}
