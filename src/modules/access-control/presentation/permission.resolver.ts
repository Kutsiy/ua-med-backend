import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { PermissionService } from '../services';
import { Permission } from './model/permission.model';
import { CreatePermissionInput, UpdatePermissionInput } from './input';

@Resolver(() => Permission)
export class PermissionResolver {
  private readonly logger = new Logger(PermissionResolver.name);

  constructor(private readonly permissionService: PermissionService) {}

  @Query(() => [Permission])
  async getAllPermissions() {
    this.logger.log('Fetching all permissions');
    return await this.permissionService.getPermissions();
  }

  @Query(() => Permission, { nullable: true })
  async getPermissionById(@Args('id') id: string) {
    this.logger.log(`Fetching permission by id=${id}`);
    return await this.permissionService.getPermissionById(id);
  }

  @Query(() => Permission, { nullable: true })
  async getPermissionByName(@Args('name') name: string) {
    this.logger.log(`Fetching permission by name=${name}`);
    return await this.permissionService.getPermissionByName(name);
  }

  @Query(() => [Permission])
  async getPermissionByAction(@Args('action') action: string) {
    this.logger.log(`Fetching permissions by action=${action}`);
    return await this.permissionService.getPermissionByAction(action);
  }

  @Query(() => [Permission])
  async getPermissionByResource(@Args('resource') resource: string) {
    this.logger.log(`Fetching permissions by resource=${resource}`);
    return await this.permissionService.getPermissionByResource(resource);
  }

  @Mutation(() => Permission)
  async createPermission(@Args('input') input: CreatePermissionInput) {
    this.logger.log('Creating permission');
    return await this.permissionService.createPermission(input);
  }

  @Mutation(() => Permission, { nullable: true })
  async updatePermission(@Args('input') input: UpdatePermissionInput) {
    this.logger.log(`Updating permission: id=${input.id}`);
    return await this.permissionService.updatePermission(input);
  }

  @Mutation(() => Boolean)
  async deletePermissionById(@Args('id') id: string) {
    this.logger.log(`Deleting permission by id=${id}`);
    await this.permissionService.deletePermissionById(id);
    return true;
  }
}
