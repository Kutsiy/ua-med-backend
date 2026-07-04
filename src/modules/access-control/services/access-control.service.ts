import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoleService } from './role.service';
import { UserRoleService } from '@modules/access-control/services';

@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(AccessControlService.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async assingDefaultRoleToUser(userId: string) {
    this.logger.log(`Assign user to role, userId=${userId}`);

    const role = await this.roleService.getRoleByName('USER');

    if (!role) {
      throw new NotFoundException('Role for user was not found.');
    }

    await this.userRoleService.addUserRole(userId, role.id);
  }
}
