import { RefreshTokenEntity } from '@modules/auth/domain';

export class RefreshTokenMapper {
  toOutput(refreshTokenEntity: RefreshTokenEntity) {
    return {
      id: refreshTokenEntity.id,
      token: refreshTokenEntity.token,
      userId: refreshTokenEntity.userId,
      expired: refreshTokenEntity.expired,
      expiresAt: refreshTokenEntity.expiresAt,
      createdAt: refreshTokenEntity.createdAt,
    };
  }
}
