import { IUserCreateInput, IUserUpdateInput } from '@modules/user/services';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

@InputType()
export class UserCreateInput implements IUserCreateInput {
  @IsNotEmpty()
  @Field()
  firstName!: string;

  @IsNotEmpty()
  @Field()
  secondName!: string;

  @Field(() => String, { nullable: true })
  middleName!: string | null;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email!: string;

  @IsNotEmpty()
  @IsPhoneNumber('UA')
  @Field()
  phoneNumber!: string;
}

@InputType()
export class UserUpdateInput implements IUserUpdateInput {
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  secondName?: string;

  @Field(() => String, { nullable: true })
  middleName?: string | null;
}
