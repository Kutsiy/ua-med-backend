import { RefreshTokenEntity } from '@modules/auth/domain';

export interface IRefreshTokenRepository {
  addRefreshToken(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>;

  findByToken(token: string): Promise<RefreshTokenEntity | null>;

  findById(id: string): Promise<RefreshTokenEntity | null>;

  expireByToken(token: string): Promise<void>;

  expireAllByUserId(userId: string): Promise<void>;

  deleteExpired(): Promise<void>;
}

export const REFRESH_TOKEN_REPO = Symbol('REFRESH_TOKEN_REPO');
