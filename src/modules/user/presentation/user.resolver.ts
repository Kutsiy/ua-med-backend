import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User, UserCreateInput, UserUpdateInput, UserMapper } from '@modules/user/presentation';
import { UserService } from '@modules/user/services';
import { JwtAuthGuard } from '@common';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return users.map((user) => UserMapper.toOutput(user));
  }

  @Query(() => User, { nullable: true })
  async getUserById(@Args('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Query(() => User, { nullable: true })
  async getUserByEmail(@Args('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  @Mutation(() => User)
  async createUser(@Args('UserCreateInput') userCreaInput: UserCreateInput) {
    return await this.userService.createUser(userCreaInput);
  }

  @Mutation(() => User)
  async updateUserByEmail(
    @Args('email') email: string,
    @Args('UserUpdateInput') userUpdateInput: UserUpdateInput,
  ) {
    return await this.userService.updateUserByEmail(email, userUpdateInput);
  }

  @Mutation(() => String)
  async deleteUser(@Args('id') id: string) {
    await this.userService.deleteUser(id);
    return 'User was deleted';
  }
}
