import { Field, ObjectType, ID } from '@nestjs/graphql';
import type { RoleModel } from '@app/common/generated/prisma/models';

@ObjectType()
export class Role implements Pick<RoleModel, 'id' | 'name' | 'description'> {
  @Field(() => ID)
  id!: string;

  name!: string;

  description: string | null = null;
}
