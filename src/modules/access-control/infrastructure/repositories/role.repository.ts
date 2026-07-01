import { Injectable, Logger } from '@nestjs/common';
import { IRoleRepository, RoleEntity } from '@modules/access-control/domain';
import { PrismaService } from '@common';
import { RoleMapper } from '../mappers';

@Injectable()
export class RoleRepository implements IRoleRepository {
  private readonly logger = new Logger(RoleRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getRoles(): Promise<RoleEntity[]> {
    this.logger.log('Get all roles');
    const roles = await this.prismaService.role.findMany();
    return roles.map((role) => RoleMapper.toDomain(role));
  }
  async getRoleByID(id: string): Promise<RoleEntity | null> {
    this.logger.log(`Find role by id=${id}`);
    const role = await this.prismaService.role.findUnique({
      where: {
        id,
      },
    });
    return role ? RoleMapper.toDomain(role) : null;
  }
  async getRoleByName(name: string): Promise<RoleEntity | null> {
    this.logger.log(`Find role by name=${name}`);
    const role = await this.prismaService.role.findUnique({
      where: {
        name,
      },
    });
    return role ? RoleMapper.toDomain(role) : null;
  }
  async createRole(role: RoleEntity): Promise<RoleEntity> {
    this.logger.log(`Create role`);
    const createdRole = await this.prismaService.role.create({
      data: RoleMapper.toObject(role),
    });
    return RoleMapper.toDomain(createdRole);
  }
  async updateRole(role: RoleEntity): Promise<RoleEntity> {
    this.logger.log(`Update role by id=${role.id}`);
    const updatedRole = await this.prismaService.role.update({
      where: {
        id: role.id,
      },
      data: RoleMapper.toObject(role),
    });
    return RoleMapper.toDomain(updatedRole);
  }
  async deleteRoleById(id: string): Promise<void> {
    this.logger.log(`Delete role by id=${id}`);
    await this.prismaService.role.delete({
      where: {
        id,
      },
    });
  }
}
