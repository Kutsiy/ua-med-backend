import { Injectable, Logger } from '@nestjs/common';
import { IPermissionRepository, PermissionEntity } from '@modules/access-control/domain';
import { PrismaService } from '@common';
import { PermissionMapper } from '../mappers';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  private readonly logger = new Logger(PermissionRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getPermissions(): Promise<PermissionEntity[]> {
    this.logger.log('Find all permissions');
    const permissions = await this.prismaService.permission.findMany();
    return permissions.map((permission) => PermissionMapper.toDomain(permission));
  }
  async getPermissionById(id: string): Promise<PermissionEntity | null> {
    this.logger.log(`Find permission by id=${id}`);
    const permission = await this.prismaService.permission.findUnique({
      where: {
        id,
      },
    });

    return permission ? PermissionMapper.toDomain(permission) : null;
  }
  async getPermissionByName(name: string): Promise<PermissionEntity | null> {
    this.logger.log(`Find permission by name=${name}`);
    const permission = await this.prismaService.permission.findUnique({
      where: {
        name,
      },
    });

    return permission ? PermissionMapper.toDomain(permission) : null;
  }

  async getPermissionByAction(action: string): Promise<PermissionEntity[]> {
    this.logger.log(`Find permissions by action=${action}`);
    const permissions = await this.prismaService.permission.findMany({
      where: {
        action,
      },
    });

    if (!permissions || permissions.length === 0) {
      return [];
    }

    return permissions.map((permission) => PermissionMapper.toDomain(permission));
  }
  async getPermissionByResource(resource: string): Promise<PermissionEntity[]> {
    this.logger.log(`Find permissions by resource=${resource}`);
    const permissions = await this.prismaService.permission.findMany({
      where: {
        resource,
      },
    });

    if (!permissions || permissions.length === 0) {
      return [];
    }

    return permissions.map((permission) => PermissionMapper.toDomain(permission));
  }

  async createPermission(permission: PermissionEntity): Promise<PermissionEntity> {
    this.logger.log('Create permission');
    const createdPermission = await this.prismaService.permission.create({
      data: PermissionMapper.toObject(permission),
    });
    return PermissionMapper.toDomain(createdPermission);
  }
  async updatePermission(permission: PermissionEntity): Promise<PermissionEntity> {
    this.logger.log(`Update permission by id=${permission.id}`);
    const updatedPermission = await this.prismaService.permission.update({
      where: {
        id: permission.id,
      },
      data: PermissionMapper.toObject(permission),
    });
    return PermissionMapper.toDomain(updatedPermission);
  }

  async deletePermissionById(id: string): Promise<void> {
    this.logger.log(`Delete permission by id=${id}`);
    await this.prismaService.permission.delete({
      where: {
        id,
      },
    });
  }
}
