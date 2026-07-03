import { Inject, Injectable, Logger } from '@nestjs/common';
import { type IRoleRepository, ROLE_REPO, RoleEntity } from '../domain';
import { RoleMapper } from './mappers';
import { IRoleCreateInput, IRoleUpdateInput } from './input';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(@Inject(ROLE_REPO) private readonly roleRepository: IRoleRepository) {}

  async getRoles() {
    this.logger.log('Fetching all roles');
    const roles = await this.roleRepository.getRoles();
    return roles.map((role) => RoleMapper.toOutput(role));
  }

  async getRoleById(id: string) {
    this.logger.log(`Fetching role by id=${id}`);
    const role = await this.roleRepository.getRoleByID(id);
    if (!role) {
      this.logger.warn(`Role not found: id=${id}`);
      return null;
    }
    return RoleMapper.toOutput(role);
  }

  async getRoleByName(name: string) {
    this.logger.log(`Fetching role by name=${name}`);
    const role = await this.roleRepository.getRoleByName(name);
    if (!role) {
      this.logger.warn(`Role not found: name=${name}`);
      return null;
    }
    return RoleMapper.toOutput(role);
  }

  async createRole(role: IRoleCreateInput) {
    this.logger.log('Creating a new role');
    const roleEntity = RoleEntity.create(role.name, role.description);
    const createdRole = await this.roleRepository.createRole(roleEntity);
    return RoleMapper.toOutput(createdRole);
  }

  async updateRole(role: IRoleUpdateInput) {
    this.logger.log(`Updating role: id=${role.id}`);
    const existingRole = await this.roleRepository.getRoleByID(role.id);
    if (!existingRole) {
      this.logger.warn(`Role update failed: role not found, id=${role.id}`);
      return null;
    }

    existingRole.updateProfile({
      name: role.name,
      description: role.description,
    });

    const updatedRole = await this.roleRepository.updateRole(existingRole);
    return RoleMapper.toOutput(updatedRole);
  }

  async deleteRole(id: string) {
    this.logger.log(`Deleting role: id=${id}`);
    await this.roleRepository.deleteRoleById(id);
  }
}
