import { Module } from '@nestjs/common';
import { PermissionService, RoleService } from './services';
import { PrismaService } from '@common';

@Module({
  imports: [PrismaService],
  providers: [PermissionService, RoleService],
})
export class AccessControl {}
