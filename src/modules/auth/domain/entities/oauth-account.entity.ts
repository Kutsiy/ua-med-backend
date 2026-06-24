type OAuthAccountCreateProps = {
  provider: string;
  providerAccountId: string;
  userId: string;
};

export class OAuthAccountEntity {
  constructor(
    private readonly _id: string,
    private readonly _provider: string,
    private readonly _providerAccountId: string,
    private readonly _userId: string,
  ) {}

  get id() {
    return this._id;
  }

  get provider() {
    return this._provider;
  }

  get providerAccountId() {
    return this._providerAccountId;
  }

  get userId() {
    return this._userId;
  }

  static create({
    provider,
    providerAccountId,
    userId,
  }: OAuthAccountCreateProps): OAuthAccountEntity {
    return new OAuthAccountEntity(crypto.randomUUID(), provider, providerAccountId, userId);
  }
}
