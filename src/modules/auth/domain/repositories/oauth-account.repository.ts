import { OAuthAccountEntity } from '@modules/auth/domain';

export interface IOAuthAccountRepository {
  createAccount(accountEntity: OAuthAccountEntity): Promise<OAuthAccountEntity>;
  deleteAccount(id: string): Promise<void>;
}
