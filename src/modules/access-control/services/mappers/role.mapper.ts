import { RoleModel } from '@common/generated/prisma/models';
import { RoleEntity } from '@modules/access-control/domain';

export class RoleMapper {
  static toObject(role: RoleEntity): RoleModel {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }
}
