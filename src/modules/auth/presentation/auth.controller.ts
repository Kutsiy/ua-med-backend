import { GoogleOAuthGuard } from '@common';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { OAuthService } from '@modules/auth/services';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly oAuthService: OAuthService,
  ) {}

  private setTokens(
    { access_token, refresh_token }: { access_token: string; refresh_token: string },
    res: FastifyReply,
  ) {
    res.setCookie('access_token', access_token);
    res.setCookie('refresh_token', refresh_token);
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
    this.setTokens(response.tokens, res);
    return res.code(302).header('Location', this.configService.getOrThrow('REDIRECT_URL')).send();
  }
}
