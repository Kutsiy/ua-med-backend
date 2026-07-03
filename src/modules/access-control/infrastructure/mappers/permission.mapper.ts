import { PermissionModel } from '@common/generated/prisma/models';
import { PermissionEntity } from '@modules/access-control/domain';

export class PermissionMapper {
  static toDomain(permission: PermissionModel): PermissionEntity {
    return new PermissionEntity(
      permission.id,
      permission.name,
      permission.action,
      permission.resource,
      permission.description,
    );
  }

  static toObject(permission: PermissionEntity): PermissionModel {
    return {
      id: permission.id,
      name: permission.name,
      action: permission.action,
      resource: permission.resource,
      description: permission.description,
    };
  }
}
