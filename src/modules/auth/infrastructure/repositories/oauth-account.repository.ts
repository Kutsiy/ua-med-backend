import { Injectable } from '@nestjs/common';
import { IOAuthAccountRepository, OAuthAccountEntity } from '@modules/auth/domain';
import { PrismaService } from '@common/services';
import { AccountMapper } from '../mapper';

@Injectable()
export class OAuthAccountRepository implements IOAuthAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createAccount(accountEntity: OAuthAccountEntity): Promise<OAuthAccountEntity> {
    const data = AccountMapper.toCreateInput(accountEntity);
    const account = await this.prismaService.oAuthAccount.create({
      data,
    });
    return AccountMapper.toDomain(account);
  }
  async deleteAccount(id: string): Promise<void> {
    await this.prismaService.oAuthAccount.delete({
      where: { id },
    });
    return;
  }
}
