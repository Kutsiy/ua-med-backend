export class UserEntity {
  constructor(
    private readonly _id: string,
    private readonly _firstName: string,
    private readonly _secondName: string,
    private readonly _email: string,
    private readonly _phoneNumber: string,
    private readonly _createdAt: Date,
    private readonly _deletedAt: Date | null,
    private readonly _bannedAt: Date | null,
    private readonly _lastOnlineAt: Date | null,
  ) {}

  get id(): string {
    return this._id;
  }
  get firstName(): string {
    return this._firstName;
  }
  get secondName(): string {
    return this._secondName;
  }
  get email(): string {
    return this._email;
  }
  get phoneNumber(): string {
    return this._phoneNumber;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get deletedAt(): Date | null {
    return this._deletedAt;
  }
  get bannedAt(): Date | null {
    return this._bannedAt;
  }
  get lastOnlineAt(): Date | null {
    return this._lastOnlineAt;
  }

  static create({
    firstName,
    secondName,
    email,
    phoneNumber,
  }: Omit<UserEntity, 'id' | 'createdAt' | 'deletedAt' | 'bannedAt' | 'lastOnlineAt'>) {
    return new UserEntity(
      crypto.randomUUID(),
      firstName,
      secondName,
      email,
      phoneNumber,
      new Date(),
      null,
      null,
      null,
    );
  }
}
