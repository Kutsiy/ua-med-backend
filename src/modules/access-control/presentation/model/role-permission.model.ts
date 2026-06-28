import { ObjectType } from '@nestjs/graphql';
import type { RolePermissionModel } from '@common/generated/prisma/models';

@ObjectType()
export class RolePermission implements Omit<RolePermissionModel, ''> {
  roleId!: string;

  permissionId!: string;
}
