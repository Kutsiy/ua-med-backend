import { Inject, Injectable, Logger } from '@nestjs/common';
import { type IRolePermissionRepository, ROLE_PERMISSION_REPO } from '../domain';
import { PermissionMapper } from './mappers';

@Injectable()
export class RolePermissionService {
  private readonly logger = new Logger(RolePermissionService.name);

  constructor(
    @Inject(ROLE_PERMISSION_REPO)
    private readonly rolePermissionRepository: IRolePermissionRepository,
  ) {}

  async getPermissionsByRoleId(roleId: string) {
    this.logger.log(`Find permissions by roleId=${roleId}`);
    const permissions = await this.rolePermissionRepository.getPermissionsByRoleId(roleId);

    return permissions.map((permission) => PermissionMapper.toOutput(permission));
  }

  async getPermissionsByUserId(userId: string) {
    this.logger.log(`Find permissions by userId=${userId}`);
    const permissions = await this.rolePermissionRepository.getPermissionsByUserId(userId);

    return permissions.map((permission) => PermissionMapper.toOutput(permission));
  }
}
