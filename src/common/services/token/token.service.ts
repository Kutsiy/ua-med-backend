import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { handleJwtError } from '@common/utils';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role?: string;
};
export type RefreshTokenPayload = {
  sub: string;
  tokenId: string;
};
type SignOptions = Omit<JwtSignOptions, 'secret' | 'expiresIn'>;
type VerifyOptions = Omit<JwtVerifyOptions, 'secret'>;

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signAccessTokenAsync(payload: AccessTokenPayload, options?: SignOptions): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('ACCESS_EXPIRES'),
        ...options,
      });
    } catch (error) {
      this.logger.error(
        'Access token signing failed',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new InternalServerErrorException('Unable to generate token');
    }
  }

  async signRefreshTokenAsync(payload: RefreshTokenPayload, options?: SignOptions): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('REFRESH_EXPIRES'),
        ...options,
      });
    } catch (error) {
      this.logger.error(
        'Refresh token signing failed',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new InternalServerErrorException('Unable to generate token');
    }
  }

  async signTokensAsync(
    accessPayload: AccessTokenPayload,
    refreshPayload: RefreshTokenPayload,
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

  async verifyAccessTokenAsync<T extends object = object>(
    token: string,
    options?: VerifyOptions,
  ): Promise<T> {
    try {
      return await this.jwtService.verifyAsync<T>(token, {
        secret: this.configService.getOrThrow('ACCESS_SECRET'),
        ...options,
      });
    } catch (error) {
      handleJwtError(error, 'verifyAccessToken');
    }
  }

  async verifyRefreshTokenAsync<T extends object = object>(
    token: string,
    options?: VerifyOptions,
  ): Promise<T> {
    try {
      return await this.jwtService.verifyAsync<T>(token, {
        secret: this.configService.getOrThrow('REFRESH_SECRET'),
        ...options,
      });
    } catch (error) {
      handleJwtError(error, 'verifyRefreshToken');
    }
  }

  async verifyTokensAsync<T extends object = object>(
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
