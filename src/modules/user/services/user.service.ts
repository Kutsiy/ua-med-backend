import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type IUserRepository, USER_REPO, UserEntity, UserWhere } from '@modules/user/domain';
import { UserMapper, IUserCreateInput, IUserUpdateInput } from '@modules/user/services';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPO) private readonly userRepository: IUserRepository) {}

  async getUserWhere(userWhere: UserWhere) {
    return this.userRepository.getUserWhere(userWhere);
  }

  async getAllUsers() {
    const users = await this.userRepository.getAllUsers();
    return users.map((user) => UserMapper.toOutput(user));
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    return user ? UserMapper.toOutput(user) : null;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    return user ? UserMapper.toOutput(user) : null;
  }

  async createUser(userInput: IUserCreateInput) {
    const userEntity = UserEntity.create({
      ...userInput,
      passLink: null,
      passLinkExpAt: null,
    });
    const user = await this.userRepository.createUser(userEntity);
    return UserMapper.toOutput(user);
  }

  async updateUserByEmail(email: string, userInput: IUserUpdateInput) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }

    user.updateProfile(userInput);
    const updatedUser = await this.userRepository.updateUserByEmail(user);
    return UserMapper.toOutput(updatedUser);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.deleteUser(id);
  }

  async activateUser(activationLink: string) {
    const user = await this.userRepository.getUserByActivationLink(activationLink);
    if (!user) {
      return null;
    }

    user.updateProfile({ activationLink: null, isActive: true });
    const updatedUser = await this.userRepository.updateUserByEmail(user);
    return UserMapper.toOutput(updatedUser);
  }

  async genPassLinkForUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }

    user.updateProfile({
      passLink: crypto.randomUUID(),
      passLinkExpAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    const updatedUser = await this.userRepository.updateUserByEmail(user);
    return UserMapper.toOutput(updatedUser);
  }
}
