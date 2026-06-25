type RefreshTokenProps = {
  id: string;
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  expired: boolean;
};

type CreateRefreshTokenProps = {
  token: string;
  userId: string;
  expiresAt: Date;
};

export class RefreshTokenEntity {
  private constructor(
    private readonly _id: string,
    private readonly _token: string,
    private readonly _userId: string,
    private readonly _createdAt: Date,
    private readonly _expiresAt: Date,
    private _expired: boolean,
  ) {}

  get id(): string {
    return this._id;
  }

  get token(): string {
    return this._token;
  }

  get userId(): string {
    return this._userId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get expired(): boolean {
    return this._expired;
  }

  static create(props: CreateRefreshTokenProps): RefreshTokenEntity {
    return new RefreshTokenEntity(
      crypto.randomUUID(),
      props.token,
      props.userId,
      new Date(),
      props.expiresAt,
      false,
    );
  }

  static restore(props: RefreshTokenProps): RefreshTokenEntity {
    return new RefreshTokenEntity(
      props.id,
      props.token,
      props.userId,
      props.createdAt,
      props.expiresAt,
      props.expired,
    );
  }

  expire(): void {
    this._expired = true;
  }

  isExpired(): boolean {
    return this._expired || this._expiresAt <= new Date();
  }
}
