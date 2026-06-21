import { Inject, Injectable } from '@nestjs/common';
import { type IUserRepository, USER_REPO, UserEntity } from '@modules/user/domain';
import { UserMapper, IUserCreateInput, IUserUpdateInput } from '@modules/user/services';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPO) private readonly userRepository: IUserRepository) {}

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    return user ? UserMapper.toOutput(user) : null;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.getUserById(email);
    return user ? UserMapper.toOutput(user) : null;
  }

  async createUser(userInput: IUserCreateInput) {
    const userEntity = UserEntity.create(userInput);
    const user = await this.userRepository.createUser(userEntity);
    return UserMapper.toOutput(user);
  }

  async updateUserByEmail(email: string, userInput: IUserUpdateInput) {
    const user = await this.userRepository.getUserByEmail(email);
    if (user) {
      user.updateProfile(userInput);
      const updatedUser = await this.userRepository.updateUserByEmail(user);
      return UserMapper.toOutput(updatedUser);
    }
    return null;
  }

  async deleteUser(id: string) {
    await this.userRepository.deleteUser(id);
  }
}
