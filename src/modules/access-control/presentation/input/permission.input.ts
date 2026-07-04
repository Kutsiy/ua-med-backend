import { Field, InputType } from '@nestjs/graphql';
import { ICreatePermissionInput, IUpdatePermissionInput } from '../../services';

@InputType()
export class CreatePermissionInput implements ICreatePermissionInput {
  @Field()
  name!: string;

  @Field()
  action!: string;

  @Field()
  resource!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;
}

@InputType()
export class UpdatePermissionInput implements IUpdatePermissionInput {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  name!: string;

  @Field(() => String, { nullable: true })
  action!: string;

  @Field(() => String, { nullable: true })
  resource!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;
}
