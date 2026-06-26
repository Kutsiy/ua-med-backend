import { IAuthAddPassword, IAuthLoginInput, IAuthSignUpInput } from '@modules/auth/services';
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber } from 'class-validator';

@InputType()
export class AuthLoginInput implements IAuthLoginInput {
  @IsEmail()
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class AuthSignUpInput implements IAuthSignUpInput {
  @Field()
  firstName!: string;

  @Field()
  secondName!: string;

  @Field(() => String, { nullable: true })
  middleName!: string | null;

  @IsEmail()
  @Field()
  email!: string;

  @Field()
  password!: string;

  @IsPhoneNumber('UA')
  @Field()
  phoneNumber!: string;
}

@InputType()
export class AuthAddPassword implements Omit<IAuthAddPassword, 'email'> {
  @Field()
  newPassword!: string;

  @Field(() => String, { nullable: true })
  oldPassword!: string | null;
}

export class ForgotPasswordInput {
  @IsEmail()
  email!: string;
}

export class ChangePasswordInput {
  newPass!: string;
  passLink!: string;
}
