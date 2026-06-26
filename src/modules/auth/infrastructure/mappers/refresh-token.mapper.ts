import { Prisma, RefreshToken } from '@common/generated/prisma/client';
import { RefreshTokenEntity } from '@modules/auth/domain';

export class RefreshTokenMapper {
  static toDomain(refreshToken: RefreshToken): RefreshTokenEntity {
    return RefreshTokenEntity.restore({
      id: refreshToken.id,
      token: refreshToken.token,
      userId: refreshToken.userId,
      createdAt: refreshToken.createdAt,
      expiresAt: refreshToken.expiresAt,
      expired: refreshToken.expired,
    });
  }

  static toCreateInput(
    refreshTokenEntity: RefreshTokenEntity,
  ): Prisma.RefreshTokenUncheckedCreateInput {
    return {
      id: refreshTokenEntity.id,
      token: refreshTokenEntity.token,
      userId: refreshTokenEntity.userId,
      createdAt: refreshTokenEntity.createdAt,
      expiresAt: refreshTokenEntity.expiresAt,
      expired: refreshTokenEntity.expired,
    };
  }

  static toUpdateInput(
    refreshTokenEntity: RefreshTokenEntity,
  ): Prisma.RefreshTokenUncheckedUpdateInput {
    return {
      token: refreshTokenEntity.token,
      userId: refreshTokenEntity.userId,
      createdAt: refreshTokenEntity.createdAt,
      expiresAt: refreshTokenEntity.expiresAt,
      expired: refreshTokenEntity.expired,
    };
  }
}
