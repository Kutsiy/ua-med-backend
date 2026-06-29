import { Injectable, Logger } from '@nestjs/common';
import { IRolePermissionRepository } from '@modules/access-control/domain';
import { PrismaService } from '@common';

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
}
