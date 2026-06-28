import { RoleModel } from '@common/generated/prisma/models';
import { RoleEnity } from '@modules/access-control/domain';

export class RoleMapper {
  static toDomain(role: RoleModel): RoleEnity {
    return new RoleEnity(role.id, role.name, role.description);
  }

  static toObject(role: RoleEnity): RoleModel {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }
}
