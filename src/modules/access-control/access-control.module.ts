import { Module } from '@nestjs/common';
import { PermissionService, RolePermissionService, RoleService, UserRoleService } from './services';
import { PrismaModule } from '@common';
import {
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
  UserRoleRepository,
} from './infrastructure';
import { CaslAbilityFactory } from './services';
import { PERMISSION_REPO, ROLE_PERMISSION_REPO, ROLE_REPO, USER_ROLE_REPO } from './domain';
import {
  PermissionsGuard,
  UserRoleResolver,
  RoleResolver,
  RolePermissionResolver,
  PermissionResolver,
} from './presentation';

@Module({
  imports: [PrismaModule],
  providers: [
    PermissionService,
    RoleService,
    {
      provide: ROLE_REPO,
      useClass: RoleRepository,
    },
    {
      provide: PERMISSION_REPO,
      useClass: PermissionRepository,
    },
    {
      provide: ROLE_PERMISSION_REPO,
      useClass: RolePermissionRepository,
    },
    {
      provide: USER_ROLE_REPO,
      useClass: UserRoleRepository,
    },
    UserRoleService,
    RolePermissionService,
    CaslAbilityFactory,
    PermissionsGuard,
    UserRoleResolver,
    RoleResolver,
    RolePermissionResolver,
    PermissionResolver,
  ],
  exports: [
    PermissionsGuard,
    PermissionService,
    RoleService,
    UserRoleService,
    RolePermissionService,
  ],
})
export class AccessControlModule {}
