export interface IUserCreateInput {
  firstName: string;
  secondName: string;
  middleName: string | null;
  email: string;
  phoneNumber: string | null;
  password: string | null;
}

export interface IUserUpdateInput {
  firstName?: string;
  secondName?: string;
  middleName?: string | null;
}
