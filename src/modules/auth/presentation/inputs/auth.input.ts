import { IAuthLoginInput } from '@modules/auth/services';
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class AuthLoginInput implements IAuthLoginInput {
  @IsEmail()
  @Field()
  email!: string;

  @Field()
  password!: string;
}
