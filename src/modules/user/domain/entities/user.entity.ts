type UserProps = {
  id: string;
  firstName: string;
  secondName: string;
  middleName: string | null;
  email: string;
  phoneNumber: string | null;
  password: string | null;
  passLink: string | null;
  passLinkExpAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
  bannedAt: Date | null;
  lastOnlineAt: Date | null;
  isActive: boolean;
  activationLink: string | null;
};

type UpdateUserProfileProps = Partial<
  Pick<
    UserProps,
    | 'firstName'
    | 'secondName'
    | 'middleName'
    | 'activationLink'
    | 'isActive'
    | 'passLink'
    | 'passLinkExpAt'
    | 'password'
  >
>;

export class UserEntity {
  constructor(
    private readonly _id: string,
    private _firstName: string,
    private _secondName: string,
    private _middleName: string | null,
    private readonly _birthDate: Date | null,
    private readonly _email: string,
    private readonly _phoneNumber: string | null,
    private _password: string | null,
    private _passLink: string | null,
    private _passLinkExpAt: Date | null,
    private readonly _createdAt: Date,
    private readonly _deletedAt: Date | null,
    private readonly _bannedAt: Date | null,
    private readonly _lastOnlineAt: Date | null,
    private _isActive: boolean,
    private _activationLink: string | null,
    // private readonly _myRoles: null,
    // private readonly _myBooking: null,
    // private readonly _myToken: null,
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

  get birthDate(): Date | null {
    return this._birthDate;
  }

  get email(): string {
    return this._email;
  }
  get phoneNumber() {
    return this._phoneNumber;
  }

  get password() {
    return this._password;
  }

  get passLink() {
    return this._passLink;
  }

  get passLinkExpAt(): Date | null {
    return this._passLinkExpAt;
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

  get isActive() {
    return this._isActive;
  }

  get activationLink(): string | null {
    return this._activationLink;
  }

  // get myRoles() {
  //   return this._myRoles;
  // }

  // get myBooking() {
  //   return this._myBooking;
  // }

  // get myToken() {
  //   return this._myToken;
  // }

  private set firstName(firstName: string) {
    this._firstName = firstName;
  }

  private set secondName(secondName: string) {
    this._secondName = secondName;
  }

  private set middleName(middleName: string | null) {
    this._middleName = middleName;
  }

  private set activationLink(activationLink: string | null) {
    this._activationLink = activationLink;
  }

  private set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  private set password(password: string | null) {
    this._password = password;
  }

  private set passLink(passLink: string | null) {
    this._passLink = passLink;
  }

  private set passLinkExpAt(passLinkExpAt: Date | null) {
    this._passLinkExpAt = passLinkExpAt;
  }

  updateProfile({
    firstName,
    secondName,
    middleName,
    activationLink,
    isActive,
    password,
    passLink,
    passLinkExpAt,
  }: UpdateUserProfileProps) {
    if (firstName !== undefined) {
      this.firstName = firstName;
    }

    if (secondName !== undefined) {
      this.secondName = secondName;
    }

    if (middleName !== undefined) {
      this.middleName = middleName;
    }

    if (activationLink) {
      this.activationLink = activationLink;
    }

    if (isActive) {
      this.isActive = isActive;
    }
    this.password = password !== undefined ? password : this.password;
    this.passLink = this.passLink = passLink !== undefined ? passLink : this.passLink;
    this.passLinkExpAt = passLinkExpAt !== undefined ? passLinkExpAt : this.passLinkExpAt;
  }

  static create({
    firstName,
    secondName,
    middleName,
    email,
    phoneNumber,
    password,
    passLink,
    passLinkExpAt,
    activationLink,
  }: Omit<UserProps, 'id' | 'createdAt' | 'deletedAt' | 'bannedAt' | 'lastOnlineAt' | 'isActive'>) {
    return new UserEntity(
      crypto.randomUUID(),
      firstName,
      secondName,
      middleName,
      null,
      email,
      phoneNumber,
      password,
      passLink,
      passLinkExpAt,
      new Date(),
      null,
      null,
      null,
      false,
      activationLink,
    );
  }
}
