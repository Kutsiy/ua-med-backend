import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

type Payload<T = string | number> = Record<string, T>;
type SignOptions = Omit<JwtSignOptions, 'secret' | 'expiresIn'>;
type VerifyOptions = Omit<JwtVerifyOptions, 'secret'>;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessTokenAsync(payload: Payload, options?: SignOptions) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('ACCESS_SECRET'),
      expiresIn: this.configService.getOrThrow('ACCESS_EXPIRES'),
      ...options,
    });
  }

  async signRefreshTokenAsync(payload: Payload, options?: SignOptions) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow('REFRESH_EXPIRES'),
      ...options,
    });
  }

  async signTokensAsync(
    accessPayload: Payload,
    refreshPayload: Payload,
    accessOptions?: SignOptions,
    refreshOptions?: SignOptions,
  ) {
    const access_token = await this.signAccessTokenAsync(accessPayload, accessOptions);
    const refresh_token = await this.signRefreshTokenAsync(refreshPayload, refreshOptions);
    return {
      access_token,
      refresh_token,
    };
  }

  async verifyAccessTokenAsync<T extends object = any>(
    token: string,
    options?: VerifyOptions,
  ): Promise<T> {
    return await this.jwtService.verifyAsync<T>(token, {
      secret: this.configService.getOrThrow('ACCESS_SECRET'),
      ...options,
    });
  }

  async verifyRefreshTokenAsync<T extends object = any>(
    token: string,
    options?: VerifyOptions,
  ): Promise<T> {
    return await this.jwtService.verifyAsync<T>(token, {
      secret: this.configService.getOrThrow('REFRESH_SECRET'),
      ...options,
    });
  }

  async verifyTokensAsync<T extends object = any>(
    accessToken: string,
    refreshToken: string,
    accessOptions?: VerifyOptions,
    refreshOptions?: VerifyOptions,
  ): Promise<Record<string, T>> {
    const accessVerify = await this.verifyAccessTokenAsync<T>(accessToken, accessOptions);
    const refreshVerify = await this.verifyRefreshTokenAsync<T>(refreshToken, refreshOptions);
    return {
      access_verify: accessVerify,
      refresh_verify: refreshVerify,
    };
  }

  decodeToken<T>(token: string): T {
    return this.jwtService.decode<T>(token);
  }
  decodeTokens<T>(accessToken: string, refreshToken: string) {
    return {
      access_token_decode: this.decodeToken<T>(accessToken),
      refresh_token_decode: this.decodeToken<T>(refreshToken),
    };
  }
}
