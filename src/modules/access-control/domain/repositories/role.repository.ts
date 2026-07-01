import { RoleEntity } from '../entities';

export interface IRoleRepository {
  getRoles(): Promise<RoleEntity[]>;
  getRoleByID(id: string): Promise<RoleEntity | null>;
  getRoleByName(name: string): Promise<RoleEntity | null>;
  createRole(role: RoleEntity): Promise<RoleEntity>;
  updateRole(role: RoleEntity): Promise<RoleEntity>;
  deleteRoleById(id: string): Promise<void>;
}

export const ROLE_REPO = Symbol('ROLE_REPO');
