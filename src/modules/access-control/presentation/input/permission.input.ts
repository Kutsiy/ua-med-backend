import { Field, ID, InputType } from '@nestjs/graphql';
import { ICreatePermissionInput, IUpdatePermissionInput } from '../../services';

@InputType()
export class CreatePermissionInput implements ICreatePermissionInput {
  @Field()
  name!: string;

  @Field()
  action!: string;

  @Field()
  resource!: string;

  @Field({ nullable: true })
  description!: string | null;
}

@InputType()
export class UpdatePermissionInput implements IUpdatePermissionInput {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: true })
  action!: string;

  @Field({ nullable: true })
  resource!: string;

  @Field({ nullable: true })
  description!: string | null;
}
