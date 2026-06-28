import { PermissionModel } from '@common/generated/prisma/models';
import { PermissionEntity } from '@modules/access-control/domain';

export class PermissionMapper {
  static toDomain(permission: PermissionModel): PermissionEntity {
    return new PermissionEntity(permission.id, permission.name, permission.description);
  }

  static toObject(permission: PermissionEntity): PermissionModel {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
    };
  }
}
