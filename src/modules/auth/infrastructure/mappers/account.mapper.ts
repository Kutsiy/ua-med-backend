import { OAuthAccount, Prisma } from '@common/generated/prisma/client';
import { OAuthAccountEntity } from '@modules/auth/domain';

export class AccountMapper {
  static toCreateInput(accountEntity: OAuthAccountEntity): Prisma.OAuthAccountUncheckedCreateInput {
    return {
      id: accountEntity.id,
      provider: accountEntity.provider,
      providerAccountId: accountEntity.providerAccountId,
      userId: accountEntity.userId,
    };
  }

  static toDomain(account: OAuthAccount): OAuthAccountEntity {
    return new OAuthAccountEntity(
      account.id,
      account.provider,
      account.providerAccountId,
      account.userId,
    );
  }
}
