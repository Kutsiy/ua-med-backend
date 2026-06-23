export interface IAuthLoginInput {
  email: string;
  password: string;
}

export interface IAuthSignUpInput {
  firstName: string;
  secondName: string;
  middleName: string | null;
  email: string;
  password: string;
  phoneNumber: string;
}
