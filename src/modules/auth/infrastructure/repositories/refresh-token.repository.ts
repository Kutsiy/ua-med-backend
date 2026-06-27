import { Injectable, Logger } from '@nestjs/common';
import { IRefreshTokenRepository, RefreshTokenEntity } from '@modules/auth/domain';
import { PrismaService } from '@common/services';
import { Prisma } from '@common/generated/prisma/client';
import { RefreshTokenMapper } from '@modules/auth/infrastructure';

type PrismaClientOrTx = PrismaService | Prisma.TransactionClient;

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  private readonly logger = new Logger(RefreshTokenRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async addRefreshToken(
    refreshToken: RefreshTokenEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<RefreshTokenEntity> {
    const db = this.getClient(tx);

    const refToken = await db.refreshToken.create({
      data: RefreshTokenMapper.toCreateInput(refreshToken),
    });

    return RefreshTokenMapper.toDomain(refToken);
  }

  async findByToken(
    token: string,
    tx?: Prisma.TransactionClient,
  ): Promise<RefreshTokenEntity | null> {
    const db = this.getClient(tx);

    const refToken = await db.refreshToken.findUnique({
      where: { token },
    });

    return refToken ? RefreshTokenMapper.toDomain(refToken) : null;
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<RefreshTokenEntity | null> {
    const db = this.getClient(tx);

    const refToken = await db.refreshToken.findUnique({
      where: { id },
    });

    return refToken ? RefreshTokenMapper.toDomain(refToken) : null;
  }

  async expireByToken(token: string, tx?: Prisma.TransactionClient): Promise<void> {
    const db = this.getClient(tx);

    await db.refreshToken.updateMany({
      where: { token, expired: false },
      data: { expired: true },
    });
  }

  async expireAllByUserId(userId: string, tx?: Prisma.TransactionClient): Promise<void> {
    const db = this.getClient(tx);

    await db.refreshToken.updateMany({
      where: { userId, expired: false },
      data: { expired: true },
    });
  }

  async deleteExpired(tx?: Prisma.TransactionClient): Promise<void> {
    const db = this.getClient(tx);

    const result = await db.refreshToken.deleteMany({
      where: {
        OR: [{ expired: true }, { expiresAt: { lt: new Date() } }],
      },
    });

    if (result.count > 0) {
      this.logger.log(`Expired refresh tokens cleaned up: count=${result.count}`);
    }
  }

  private getClient(tx?: Prisma.TransactionClient): PrismaClientOrTx {
    return tx ?? this.prismaService;
  }
}
