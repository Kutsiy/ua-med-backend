import { RoleEntity } from '@modules/access-control/domain';
import { IRoleOutput } from '../outputs/role.output';

export class RoleMapper {
  static toOutput(role: RoleEntity): IRoleOutput {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }
}
