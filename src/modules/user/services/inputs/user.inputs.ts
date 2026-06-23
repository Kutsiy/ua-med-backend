export interface IUserCreateInput {
  firstName: string;
  secondName: string;
  middleName: string | null;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface IUserUpdateInput {
  firstName?: string;
  secondName?: string;
  middleName?: string | null;
}
