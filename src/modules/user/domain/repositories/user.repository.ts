import { UserEntity } from '@modules/user/domain';

export interface IUserRepository {
  getUserById(id: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<UserEntity>;
  updateUser(user: UserEntity): Promise<UserEntity>;
  deleteUser(id: string): Promise<void>;
}
