import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import { IRefreshTokenCreateInput } from '@modules/auth/services';
import {
  type IRefreshTokenRepository,
  REFRESH_TOKEN_REPO,
  RefreshTokenEntity,
} from '@modules/auth/domain';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthRefreshTokenService {
  constructor(
    @Inject(REFRESH_TOKEN_REPO) private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly configService: ConfigService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async addToken(createTokenInput: IRefreshTokenCreateInput) {
    return this.refreshTokenRepo.addRefreshToken(
      RefreshTokenEntity.create({
        ...createTokenInput,
        expiresAt: new Date(
          Date.now() +
            this.configService.getOrThrow<number>('REFRESH_EXPIRES_NUM') * 24 * 60 * 60 * 1000,
        ),
        token: this.hashToken(createTokenInput.token),
      }),
    );
  }

  async findValidToken(rawToken: string): Promise<RefreshTokenEntity | null> {
    const storedToken = await this.refreshTokenRepo.findByToken(this.hashToken(rawToken));
    if (!storedToken || storedToken.isExpired()) {
      return null;
    }
    return storedToken;
  }

  async closeUserTokens(userId: string) {
    await this.refreshTokenRepo.expireAllByUserId(userId);
  }

  async closeTokenByToken(token: string) {
    const storedToken = await this.findValidToken(token);
    if (!storedToken) {
      throw new UnauthorizedException();
    }
    await this.refreshTokenRepo.expireByToken(this.hashToken(token));
  }
}
