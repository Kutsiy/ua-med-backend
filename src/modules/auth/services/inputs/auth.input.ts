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

export interface IAuthAddPassword {
  email: string;
  newPassword: string;
  oldPassword?: string | null;
}

export interface IAuthLogOutInput {
  userId: string;
}

export interface IAuthRefreshTokensInput {
  refresh_token: string;
  user: {
    id: string;
  };
}
