import { ObjectType, Field, ID } from '@nestjs/graphql';
import type { PermissionModel } from '@common/generated/prisma/models';

@ObjectType()
export class Permission implements Pick<
  PermissionModel,
  'id' | 'name' | 'description'
> {
  @Field(() => ID)
  id!: string;

  name!: string;

  description: string | null = null;
}
