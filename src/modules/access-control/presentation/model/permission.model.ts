import { ObjectType, Field, ID } from '@nestjs/graphql';
import type { PermissionModel } from '@common/generated/prisma/models';

@ObjectType()
export class Permission implements Omit<PermissionModel, ''> {
  @Field(() => ID)
  id!: string;

  name!: string;

  description: string | null = null;
}
