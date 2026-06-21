export interface IUserCreateInput {
  firstName: string;
  secondName: string;
  middleName: string | null;
  email: string;
  phoneNumber: string;
}

export interface IUserUpdateInput {
  firstName?: string;
  secondName?: string;
  middleName?: string | null;
}
