import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Role } from './model/role.model';
import { RoleCreateInput, RoleUpdateInput } from './input';
import { RoleService } from '../services';

@Resolver(() => Role)
export class RoleResolver {
  private readonly logger = new Logger(RoleResolver.name);

  constructor(private readonly roleService: RoleService) {}

  @Query(() => [Role])
  async getAllroles() {
    this.logger.log('Fetching all roles');
    return await this.roleService.getRoles();
  }

  @Query(() => Role, { nullable: true })
  async getRoleById(@Args('id') id: string) {
    this.logger.log(`Fetching role by id=${id}`);
    return await this.roleService.getRoleById(id);
  }

  @Query(() => Role, { nullable: true })
  async getRoleByName(@Args('name') name: string) {
    this.logger.log(`Fetching role by name=${name}`);
    return await this.roleService.getRoleByName(name);
  }

  @Mutation(() => Role)
  async createRole(@Args('input') input: RoleCreateInput) {
    this.logger.log('Create role');
    return await this.roleService.createRole(input);
  }

  @Mutation(() => Role, { nullable: true })
  async updateRole(@Args('input') input: RoleUpdateInput) {
    this.logger.log(`Update role: id=${input.id}`);
    return await this.roleService.updateRole(input);
  }

  @Mutation(() => Boolean)
  async deleteRole(@Args('id') id: string) {
    this.logger.log(`Delete role: id=${id}`);
    await this.roleService.deleteRole(id);
    return true;
  }
}
