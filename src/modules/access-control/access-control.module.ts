import { Module } from '@nestjs/common';
import { PermissionService, RoleService } from './services';
import { PrismaService } from '@common';
import {
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
} from '@modules/access-control/infrastructure';

@Module({
  imports: [PrismaService],
  providers: [
    PermissionService,
    RoleService,
    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,
  ],
})
export class AccessControl {}
