import { Inject, Injectable } from '@nestjs/common';
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
    const refToken = await this.refreshTokenRepo.addRefreshToken(
      RefreshTokenEntity.create({
        ...createTokenInput,
        expiresAt: new Date(
          new Date().getDay() + this.configService.getOrThrow<number>('REFRESH_EXPIRES_NUM'),
        ),
        token: this.hashToken(createTokenInput.token),
      }),
    );
    return refToken;
  }

  async closeUserTokens(userId: string) {
    await this.refreshTokenRepo.expireAllByUserId(userId);
  }

  async closeTokenByToken(token: string) {
    await this.refreshTokenRepo.expireByToken(this.hashToken(token));
  }
}
