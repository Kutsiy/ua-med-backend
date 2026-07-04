import { OAuthAccountEntity } from '../../domain';
import { IAccountsOutput } from '../outputs';

export class AccountMapper {
  static toOutput(accountEntity: OAuthAccountEntity): IAccountsOutput {
    return {
      id: accountEntity.id,
      provider: accountEntity.provider,
      providerAccountId: accountEntity.providerAccountId,
      userId: accountEntity.userId,
    };
  }
}
