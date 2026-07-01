import { Injectable, Logger } from '@nestjs/common';
import { IRolePermissionRepository, PermissionEntity } from '@modules/access-control/domain';
import { PrismaService } from '@common';
import { PermissionMapper } from '../mappers';

@Injectable()
export class RolePermissionRepository implements IRolePermissionRepository {
  private readonly logger = new Logger(RolePermissionRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async addPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    this.logger.log('Add permission to role');
    await this.prismaService.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    this.logger.log(
      `Delete role-permission relation by uniqe id\`s: roleId=${roleId}; permissionId=${permissionId}`,
    );
    await this.prismaService.rolePermission.delete({
      where: {
        roleId_permissionId: {
          permissionId,
          roleId,
        },
      },
    });
  }
  async removeAllPermissionsFromRole(roleId: string): Promise<void> {
    this.logger.log(`Delete role-permission relation by roleId=${roleId}`);
    await this.prismaService.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });
  }
  async removePermissionFromAllRoles(permissionId: string): Promise<void> {
    this.logger.log(`Delete role-permission relation by permissionId=${permissionId}`);
    await this.prismaService.rolePermission.deleteMany({
      where: {
        permissionId,
      },
    });
  }

  async getPermissionsByRoleId(roleId: string): Promise<PermissionEntity[]> {
    this.logger.log(`Get permissions by roleId=${roleId}`);
    const permissions = await this.prismaService.rolePermission.findMany({
      where: {
        roleId,
      },
      include: {
        permission: true,
      },
    });

    if (!permissions || permissions.length === 0) {
      return [];
    }
    return permissions.map((permission) => PermissionMapper.toDomain(permission.permission));
  }

  async getPermissionsByUserId(userId: string): Promise<PermissionEntity[]> {
    this.logger.log(`Find permissions by userId=${userId}`);
    const rolePermissions = await this.prismaService.rolePermission.findMany({
      where: {
        role: {
          user: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        permission: true,
      },
    });

    const permissions = rolePermissions.map((rolePermission) =>
      PermissionMapper.toDomain(rolePermission.permission),
    );

    return Array.from(
      new Map(permissions.map((permission) => [permission.id, permission])).values(),
    );
  }
}
