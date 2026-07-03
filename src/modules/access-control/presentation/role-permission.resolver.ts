import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { RolePermissionService } from '../services';
import { Role } from './model/role.model';
import { Permission } from './model/permission.model';
import {
  AddPermissionToRoleInput,
  RemovePermissionFromRoleInput,
  RemoveAllPermissionsFromRoleInput,
  RemovePermissionFromAllRolesInput,
} from './input';

@Resolver(() => Role)
export class RolePermissionResolver {
  private readonly logger = new Logger(RolePermissionResolver.name);

  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @ResolveField('permissions', () => [Permission])
  async findPermissionsByRoleId(@Parent() role: Role) {
    this.logger.log(`Find permissions by roleId=${role.id}`);
    return await this.rolePermissionService.getPermissionsByRoleId(role.id);
  }

  @Mutation(() => Boolean)
  async addPermissionToRole(@Args('input') input: AddPermissionToRoleInput) {
    this.logger.log(
      `Add permission to role: roleId=${input.roleId} permissionId=${input.permissionId}`,
    );

    await this.rolePermissionService.addPermissionToRole(input.roleId, input.permissionId);

    return true;
  }

  @Mutation(() => Boolean)
  async removePermissionFromRole(@Args('input') input: RemovePermissionFromRoleInput) {
    this.logger.log(
      `Remove permission from role: roleId=${input.roleId} permissionId=${input.permissionId}`,
    );

    await this.rolePermissionService.removePermissionFromRole(input.roleId, input.permissionId);

    return true;
  }

  @Mutation(() => Boolean)
  async removeAllPermissionsFromRole(@Args('input') input: RemoveAllPermissionsFromRoleInput) {
    this.logger.log(`Remove all permissions from role: roleId=${input.roleId}`);

    await this.rolePermissionService.removeAllPermissionsFromRole(input.roleId);

    return true;
  }

  @Mutation(() => Boolean)
  async removePermissionFromAllRoles(@Args('input') input: RemovePermissionFromAllRolesInput) {
    this.logger.log(`Remove permission from all roles: permissionId=${input.permissionId}`);

    await this.rolePermissionService.removePermissionFromAllRoles(input.permissionId);

    return true;
  }
}
