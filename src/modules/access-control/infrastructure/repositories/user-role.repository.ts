import { Injectable, Logger } from '@nestjs/common';
import { IUserRoleRepository } from '../../domain/repositories/user-role.repository';
import { RoleEntity } from '../../domain';
import { PrismaService } from '@common';
import { RoleMapper } from '../mappers';

@Injectable()
export class UserRoleRepository implements IUserRoleRepository {
  private readonly logger = new Logger(UserRoleRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async addUserRole(userId: string, roleId: string): Promise<void> {
    this.logger.log(`Add role to user: userId=${userId}, roleId=${roleId}`);
    await this.prismaService.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeUserRole(userId: string, roleId: string): Promise<void> {
    this.logger.log(`Remove role from user: userId=${userId}, roleId=${roleId}`);
    await this.prismaService.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }
  async removeAllRolesFromUser(userId: string): Promise<void> {
    this.logger.log(`Remove all roles from user: userId=${userId}`);
    await this.prismaService.userRole.deleteMany({
      where: {
        userId,
      },
    });
  }
  async removeRoleFromAllUsers(roleId: string): Promise<void> {
    this.logger.log(`Remove role from all users: roleId=${roleId}`);
    await this.prismaService.userRole.deleteMany({
      where: {
        roleId,
      },
    });
  }
  async findRolesByUserId(userId: string): Promise<RoleEntity[]> {
    this.logger.log(`Find roles by userId=${userId}`);
    const userRoles = await this.prismaService.userRole.findMany({
      where: {
        userId,
      },
      include: {
        role: true,
      },
    });

    return userRoles.length > 0 ? userRoles.map((ur) => RoleMapper.toDomain(ur.role)) : [];
  }
}
