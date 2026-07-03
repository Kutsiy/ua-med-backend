import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { UserRoleService } from '../services';
import { User } from '@modules/user';
import { Role } from './model/role.model';
import {
  AddRoleToUserInput,
  RemoveRoleFromUserInput,
  RemoveAllRolesFromUserInput,
  RemoveRoleFromAllUsersInput,
} from './input';

@Resolver(() => User)
export class UserRoleResolver {
  private readonly logger = new Logger(UserRoleResolver.name);

  constructor(private readonly userRoleService: UserRoleService) {}

  @ResolveField('roles', () => [Role])
  async findRolesByUserId(@Parent() user: User) {
    this.logger.log(`Find roles by userId=${user.id}`);
    return await this.userRoleService.getRolesByUserId(user.id);
  }

  @Mutation(() => Boolean)
  async addRoleToUser(@Args('input') addRoleToUserInput: AddRoleToUserInput) {
    this.logger.log(
      `Add role to user by id: userId=${addRoleToUserInput.userId} roleId=${addRoleToUserInput.roleId}`,
    );

    await this.userRoleService.addUserRole(addRoleToUserInput.userId, addRoleToUserInput.roleId);

    return true;
  }

  @Mutation(() => Boolean)
  async removeRoleFromUser(@Args('input') removeRoleFromUserInput: RemoveRoleFromUserInput) {
    this.logger.log(
      `Remove role from user by id: userId=${removeRoleFromUserInput.userId} roleId=${removeRoleFromUserInput.roleId}`,
    );

    await this.userRoleService.removeUserRole(
      removeRoleFromUserInput.userId,
      removeRoleFromUserInput.roleId,
    );

    return true;
  }

  @Mutation(() => Boolean)
  async removeAllRolesFromUser(
    @Args('input') removeAllRolesFromUserInput: RemoveAllRolesFromUserInput,
  ) {
    this.logger.log(
      `Remove all roles from user by id: userId=${removeAllRolesFromUserInput.userId}`,
    );

    await this.userRoleService.removeAllRolesFromUser(removeAllRolesFromUserInput.userId);

    return true;
  }

  @Mutation(() => Boolean)
  async removeRoleFromAllUsers(
    @Args('input') removeRoleFromAllUsersInput: RemoveRoleFromAllUsersInput,
  ) {
    this.logger.log(
      `Remove role from all users by id: roleId=${removeRoleFromAllUsersInput.roleId}`,
    );

    await this.userRoleService.removeRoleFromAllUsers(removeRoleFromAllUsersInput.roleId);

    return true;
  }
}
