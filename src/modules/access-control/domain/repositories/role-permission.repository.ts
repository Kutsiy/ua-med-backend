import { PermissionEntity } from '../entities';

export interface IRolePermissionRepository {
  addPermissionToRole(roleId: string, permissionId: string): Promise<void>;
  removePermissionFromRole(roleId: string, permissionId: string): Promise<void>;
  removeAllPermissionsFromRole(roleId: string): Promise<void>;
  removePermissionFromAllRoles(permissionId: string): Promise<void>;
  getPermissionsByRoleId(roleId: string): Promise<PermissionEntity[]>;
  getPermissionsByUserId(userId: string): Promise<PermissionEntity[]>;
}

export const ROLE_PERMISSION_REPO = Symbol('ROLE_PERMISSION_REPO');
