export interface IUserCreateInput {
  firstName: string;
  secondName: string;
  middleName: string | null;
  email: string;
  phoneNumber: string | null;
  password: string | null;
  activationLink: string | null;
}

export interface IUserUpdateInput {
  firstName?: string;
  secondName?: string;
  middleName?: string | null;
  passLink?: string | null;
  passLinkExpAt?: Date | null;
  password?: string | null;
}
