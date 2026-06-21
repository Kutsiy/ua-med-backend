import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User, UserCreateInput, UserUpdateInput } from '@modules/user/presentation';
import { UserService } from '@modules/user/services';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getAllUsers() {
    return await this.userService.getAllUsers();
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
