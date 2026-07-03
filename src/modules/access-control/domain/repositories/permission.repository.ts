import { PermissionEntity } from '../entities';

export interface IPermissionRepository {
  getPermissions(): Promise<PermissionEntity[]>;
  getPermissionById(id: string): Promise<PermissionEntity | null>;
  getPermissionByName(name: string): Promise<PermissionEntity | null>;
  getPermissionByAction(action: string): Promise<PermissionEntity[]>;
  getPermissionByResource(resource: string): Promise<PermissionEntity[]>;
  createPermission(permission: PermissionEntity): Promise<PermissionEntity>;
  updatePermission(permission: PermissionEntity): Promise<PermissionEntity>;
  deletePermissionById(id: string): Promise<void>;
}

export const PERMISSION_REPO = Symbol('PERMISSION_REPO');
