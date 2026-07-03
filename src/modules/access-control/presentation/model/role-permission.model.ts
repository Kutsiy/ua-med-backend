import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RolePermission {
  roleId!: string;

  permissionId!: string;
}
