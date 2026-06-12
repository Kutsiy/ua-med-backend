import { ObjectType } from '@nestjs/graphql';
import type { RolePermissionModel } from '@app/common/generated/prisma/models';

@ObjectType()
export class RolePermission implements Pick<
  RolePermissionModel,
  'roleId' | 'permissionId'
> {
  roleId!: string;

  permissionId!: string;
}
