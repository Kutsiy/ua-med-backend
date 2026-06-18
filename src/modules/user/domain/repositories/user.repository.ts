import { UserEntity } from '@modules/user/domain';

export interface IUserRepository {
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<UserEntity>;
  updateUserByEmail(user: UserEntity): Promise<UserEntity>;
  deleteUser(id: string): Promise<void>;
}

export const USER_REPO = Symbol('USER_REPO');
