import { PermissionEntity } from '@modules/access-control/domain';
import { ICreatePermissionInput } from '../input';
import { randomUUID } from 'crypto';
import { IPermissionOutput } from '../outputs';

export class PermissionMapper {
  static fromCreateInput(input: ICreatePermissionInput): PermissionEntity {
    return new PermissionEntity(
      randomUUID(),
      input.name,
      input.action,
      input.resource,
      input.description ?? null,
    );
  }

  static toOutput(permission: PermissionEntity): IPermissionOutput {
    return {
      id: permission.id,
      name: permission.name,
      action: permission.action,
      resource: permission.resource,
      description: permission.description,
    };
  }
}
