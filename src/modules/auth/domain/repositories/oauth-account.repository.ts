import { OAuthAccountEntity } from '@modules/auth/domain';

export interface IOAuthAccountRepository {
  createAccount(accountEntity: OAuthAccountEntity): Promise<OAuthAccountEntity>;

  deleteAccount(id: string): Promise<void>;

  getAllAccountsByUserId(userId: string): Promise<OAuthAccountEntity[]>;
}

export const OAUTH_ACCOUNT_REPO = Symbol('OAUTH_ACCOUNT_REPO');
