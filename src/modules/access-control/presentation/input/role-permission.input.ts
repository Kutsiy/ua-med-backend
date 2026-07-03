import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddPermissionToRoleInput {
  @Field()
  roleId!: string;

  @Field()
  permissionId!: string;
}

@InputType()
export class RemovePermissionFromRoleInput {
  @Field()
  roleId!: string;

  @Field()
  permissionId!: string;
}

@InputType()
export class RemoveAllPermissionsFromRoleInput {
  @Field()
  roleId!: string;
}

@InputType()
export class RemovePermissionFromAllRolesInput {
  @Field()
  permissionId!: string;
}
