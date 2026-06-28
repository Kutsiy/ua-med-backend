import { RoleEnity } from '../entities';

export interface IRoleRepository {
  getRoles(): Promise<RoleEnity[]>;
  getRoleByID(id: string): Promise<RoleEnity | null>;
  getRoleByName(name: string): Promise<RoleEnity | null>;
  createRole(role: RoleEnity): Promise<RoleEnity>;
  updateRole(role: RoleEnity): Promise<RoleEnity>;
  deleteRoleById(id: string): Promise<void>;
}

export const ROLE_REPO = Symbol('ROLE_REPO');
