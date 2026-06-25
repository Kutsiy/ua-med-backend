import { CookieSerializeOptions } from '@fastify/cookie';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply } from 'fastify';

@Injectable()
export class AuthCookieService {
  constructor(private readonly configService: ConfigService) {}

  setTokens(
    { access_token, refresh_token }: { access_token: string; refresh_token: string },
    res: FastifyReply,
  ) {
    const cookieConfig: CookieSerializeOptions = {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
    };

    res.setCookie('access_token', access_token, {
      ...cookieConfig,
      maxAge: this.configService.getOrThrow('ACCESS_EXPIRES_NUM') * 60,
    });
    res.setCookie('refresh_token', refresh_token, {
      ...cookieConfig,
      maxAge: this.configService.getOrThrow('REFRESH_EXPIRES_NUM') * 60 * 60 * 24,
    });
  }

  clearTokens(response: FastifyReply) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
  }
}
