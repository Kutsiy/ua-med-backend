import { IUserCreateInput, IUserUpdateInput } from '@modules/user/services';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserCreateInput implements IUserCreateInput {
  @Field()
  firstName!: string;
  @Field()
  secondName!: string;
  @Field(() => String, { nullable: true })
  middleName!: string | null;
  @Field()
  email!: string;
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
