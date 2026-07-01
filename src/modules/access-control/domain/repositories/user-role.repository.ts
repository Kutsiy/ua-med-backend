import { RoleEntity } from '../entities/role.entity';

export interface IUserRoleRepository {
  addUserRole(userId: string, roleId: string): Promise<void>;
  removeUserRole(userId: string, roleId: string): Promise<void>;
  removeAllRolesFromUser(userId: string): Promise<void>;
  removeRoleFromAllUsers(roleId: string): Promise<void>;
  findRolesByUserId(userId: string): Promise<RoleEntity[]>;
}

export const USER_ROLE_REPO = Symbol('USER_ROLE_REPO');
