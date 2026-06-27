import { Injectable, Logger } from '@nestjs/common';
import { IOAuthAccountRepository, OAuthAccountEntity } from '@modules/auth/domain';
import { PrismaService } from '@common/services';
import { AccountMapper } from '../mappers';
import { withPrismaErrorHandling } from '@common/error-handlers';

@Injectable()
export class OAuthAccountRepository implements IOAuthAccountRepository {
  private readonly logger = new Logger(OAuthAccountRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createAccount(accountEntity: OAuthAccountEntity): Promise<OAuthAccountEntity> {
    return withPrismaErrorHandling(async () => {
      const data = AccountMapper.toCreateInput(accountEntity);
      const account = await this.prismaService.oAuthAccount.create({
        data,
      });
      this.logger.log(
        `OAuth account created: userId=${accountEntity.userId}, provider=${accountEntity.provider}`,
      );
      return AccountMapper.toDomain(account);
    }, 'createAccount');
  }

  async deleteAccount(id: string): Promise<void> {
    await withPrismaErrorHandling(async () => {
      await this.prismaService.oAuthAccount.delete({
        where: { id },
      });
      this.logger.log(`OAuth account deleted: accountId=${id}`);
    }, 'deleteAccount');
  }
}
