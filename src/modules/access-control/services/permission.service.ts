import { Inject, Injectable, Logger } from '@nestjs/common';
import { type IPermissionRepository, PERMISSION_REPO, PermissionEntity } from '../domain';
import { ICreatePermissionInput, IUpdatePermissionInput } from './input';
import { PermissionMapper } from './mappers';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @Inject(PERMISSION_REPO) private readonly permissionRepository: IPermissionRepository,
  ) {}

  async getPermissions() {
    this.logger.log('Fetching all permissions');
    const permissions = await this.permissionRepository.getPermissions();
    return permissions.map((permission) => PermissionMapper.toOutput(permission));
  }

  async getPermissionById(id: string) {
    this.logger.log(`Fetching permission by id=${id}`);
    const permission = await this.permissionRepository.getPermissionById(id);
    if (!permission) {
      this.logger.warn(`Permission not found: id=${id}`);
      return null;
    }
    return PermissionMapper.toOutput(permission);
  }

  async getPermissionByName(name: string) {
    this.logger.log(`Fetching permission by name=${name}`);
    const permission = await this.permissionRepository.getPermissionByName(name);
    if (!permission) {
      this.logger.warn(`Permission not found: name=${name}`);
      return null;
    }
    return PermissionMapper.toOutput(permission);
  }

  async getPermissionByAction(action: string) {
    this.logger.log(`Fetching permission by action=${action}`);
    const permission = await this.permissionRepository.getPermissionByAction(action);
    if (!permission) {
      this.logger.warn(`Permission not found: action=${action}`);
      return null;
    }
    return PermissionMapper.toOutput(permission);
  }

  async getPermissionByResource(resource: string) {
    this.logger.log(`Fetching permission by resource=${resource}`);
    const permission = await this.permissionRepository.getPermissionByResource(resource);
    if (!permission) {
      this.logger.warn(`Permission not found: resource=${resource}`);
      return null;
    }
    return PermissionMapper.toOutput(permission);
  }
  async createPermission(permission: ICreatePermissionInput) {
    this.logger.log('Creating a new permission');
    const permissionEntity = PermissionEntity.create({
      name: permission.name,
      action: permission.action,
      resource: permission.resource,
      description: permission.description,
    });
    return PermissionMapper.toOutput(
      await this.permissionRepository.createPermission(permissionEntity),
    );
  }
  async updatePermission(permission: IUpdatePermissionInput) {
    this.logger.log(`Updating permission: id=${permission.id}`);
    const existingPermission = await this.permissionRepository.getPermissionById(permission.id);
    if (!existingPermission) {
      this.logger.warn(`Permission update failed: permission not found, id=${permission.id}`);
      return null;
    }

    existingPermission.updateProfile({
      name: permission.name,
      description: permission.description,
      action: permission.action,
      resource: permission.resource,
    });

    return PermissionMapper.toOutput(
      await this.permissionRepository.updatePermission(existingPermission),
    );
  }
  async deletePermissionById(id: string) {
    this.logger.log(`Deleting permission by id=${id}`);
    await this.permissionRepository.deletePermissionById(id);
  }
}
