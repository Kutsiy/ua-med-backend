import { Field, InputType } from '@nestjs/graphql';
import { IRoleCreateInput, IRoleUpdateInput } from '../../services';

@InputType()
export class RoleCreateInput implements IRoleCreateInput {
  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;
}

@InputType()
export class RoleUpdateInput implements IRoleUpdateInput {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;
}
