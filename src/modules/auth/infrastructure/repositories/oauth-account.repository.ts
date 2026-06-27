import { Injectable } from '@nestjs/common';
import { IOAuthAccountRepository, OAuthAccountEntity } from '@modules/auth/domain';
import { PrismaService } from '@common/services';
import { AccountMapper } from '../mappers';
import { withPrismaErrorHandling } from '@common/utils';

@Injectable()
export class OAuthAccountRepository implements IOAuthAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAccount(accountEntity: OAuthAccountEntity): Promise<OAuthAccountEntity> {
    return withPrismaErrorHandling(async () => {
      const data = AccountMapper.toCreateInput(accountEntity);
      const account = await this.prismaService.oAuthAccount.create({
        data,
      });
      return AccountMapper.toDomain(account);
    }, 'createAccount');
  }

  async deleteAccount(id: string): Promise<void> {
    await withPrismaErrorHandling(async () => {
      await this.prismaService.oAuthAccount.delete({
        where: { id },
      });
    }, 'deleteAccount');
  }
}
