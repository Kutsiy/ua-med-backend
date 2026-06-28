import { Field, ObjectType, ID } from '@nestjs/graphql';
import type { RoleModel } from '@common/generated/prisma/models';

@ObjectType()
export class Role implements Omit<RoleModel, ''> {
  @Field(() => ID)
  id!: string;

  name!: string;

  description: string | null = null;
}
