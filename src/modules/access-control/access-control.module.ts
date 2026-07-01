import { Module } from '@nestjs/common';
import { PermissionService, RolePermissionService, RoleService, UserRoleService } from './services';
import { PrismaService } from '@common';
import {
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
  UserRoleRepository,
} from '@modules/access-control/infrastructure';
import { CaslAbilityFactory } from './services';
import { PERMISSION_REPO, ROLE_PERMISSION_REPO, ROLE_REPO, USER_ROLE_REPO } from './domain';

@Module({
  imports: [PrismaService],
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
  ],
})
export class AccessControl {}
