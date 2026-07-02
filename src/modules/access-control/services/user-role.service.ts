import { Inject, Injectable, Logger } from '@nestjs/common';
import { type IUserRoleRepository, USER_ROLE_REPO } from '../domain';
import { RoleMapper } from './mappers';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);
  constructor(@Inject(USER_ROLE_REPO) private readonly userRoleRepository: IUserRoleRepository) {}

  async addUserRole(userId: string, roleId: string) {
    this.logger.log(`Adding roleId=${roleId} to userId=${userId}`);
    await this.userRoleRepository.addUserRole(userId, roleId);
  }

  async removeUserRole(userId: string, roleId: string) {
    this.logger.log(`Removing roleId=${roleId} from userId=${userId}`);
    await this.userRoleRepository.removeUserRole(userId, roleId);
  }

  async removeAllRolesFromUser(userId: string) {
    this.logger.log(`Removing all roles from userId=${userId}`);
    await this.userRoleRepository.removeAllRolesFromUser(userId);
  }

  async removeRoleFromAllUsers(roleId: string) {
    this.logger.log(`Removing roleId=${roleId} from all users`);
    await this.userRoleRepository.removeRoleFromAllUsers(roleId);
  }

  async getRolesByUserId(userId: string) {
    this.logger.log(`Find roles by userId=${userId}`);
    const roles = await this.userRoleRepository.findRolesByUserId(userId);

    if (!roles || roles.length === 0) {
      return null;
    }

    return roles.map((role) => RoleMapper.toOutput(role));
  }
}
