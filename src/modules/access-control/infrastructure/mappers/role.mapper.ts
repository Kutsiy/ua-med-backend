import { RoleModel } from '@common/generated/prisma/models';
import { RoleEntity } from '@modules/access-control/domain';

export class RoleMapper {
  static toDomain(role: RoleModel): RoleEntity {
    return new RoleEntity(role.id, role.name, role.description);
  }

  static toObject(role: RoleEntity): RoleModel {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }
}
