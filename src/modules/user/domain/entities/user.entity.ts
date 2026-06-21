type UserProps = {
  id: string;
  firstName: string;
  secondName: string;
  middleName: string | null;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  deletedAt: Date | null;
  bannedAt: Date | null;
  lastOnlineAt: Date | null;
};

type UpdateUserProfileProps = Partial<Pick<UserProps, 'firstName' | 'secondName' | 'middleName'>>;

export class UserEntity {
  constructor(
    private readonly _id: string,
    private _firstName: string,
    private _secondName: string,
    private _middleName: string | null,
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

  get middleName(): string | null {
    return this._middleName;
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

  private set firstName(firstName: string) {
    this._firstName = firstName;
  }

  private set secondName(secondName: string) {
    this._secondName = secondName;
  }

  private set middleName(middleName: string | null) {
    this._middleName = middleName;
  }

  updateProfile({ firstName, secondName, middleName }: UpdateUserProfileProps) {
    if (firstName !== undefined) {
      this.firstName = firstName;
    }

    if (secondName !== undefined) {
      this.secondName = secondName;
    }

    if (middleName !== undefined) {
      this.middleName = middleName;
    }
  }

  static create({
    firstName,
    secondName,
    middleName,
    email,
    phoneNumber,
  }: Omit<UserProps, 'id' | 'createdAt' | 'deletedAt' | 'bannedAt' | 'lastOnlineAt'>) {
    return new UserEntity(
      crypto.randomUUID(),
      firstName,
      secondName,
      middleName,
      email,
      phoneNumber,
      new Date(),
      null,
      null,
      null,
    );
  }
}
