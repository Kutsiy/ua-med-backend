import { SetMetadata } from '@nestjs/common';
import { AppAbility } from '../../services';

interface IPermissionHandler {
  handle(ability: AppAbility): boolean;
}

type PermissionHandlerCallback = (ability: AppAbility) => boolean;

export type PermissionHandler = IPermissionHandler | PermissionHandlerCallback;

export const CHECK_PERMISSIONS_KEY = 'check_permissions';
export const CheckPermissions = (...handlers: PermissionHandler[]) =>
  SetMetadata(CHECK_PERMISSIONS_KEY, handlers);
