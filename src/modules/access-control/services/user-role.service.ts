import { Inject, Injectable, Logger } from '@nestjs/common';
import { type IUserRoleRepository, USER_ROLE_REPO } from '../domain';
import { RoleMapper } from './mappers';

@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name);
  constructor(@Inject(USER_ROLE_REPO) private readonly userRoleRepository: IUserRoleRepository) {}

  async getRolesByUserId(userId: string) {
    this.logger.log(`Find roles by userId=${userId}`);
    const roles = await this.userRoleRepository.findRolesByUserId(userId);

    if (!roles || roles.length === 0) {
      return null;
    }

    return roles.map((role) => RoleMapper.toObject(role));
  }
}
