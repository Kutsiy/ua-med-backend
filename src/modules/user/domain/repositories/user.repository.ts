import { UserEntity } from '@modules/user/domain';
import { ClassFields } from '@utils';

export type UserWhere = Partial<
  ClassFields<
    Pick<UserEntity, 'id' | 'email' | 'passLinkExpAt' | 'passLink' | 'firstName' | 'secondName'>
  >
>;

export interface IUserRepository {
  getAllUsers(): Promise<UserEntity[]>;
  getUserWhere(userWhere: UserWhere): Promise<UserEntity | null>;
  getUserById(id: string): Promise<UserEntity | null>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(user: UserEntity): Promise<UserEntity>;
  updateUserByEmail(user: UserEntity): Promise<UserEntity>;
  getUserByActivationLink(activationLink: string): Promise<UserEntity | null>;
  deleteUser(id: string): Promise<void>;
}

export const USER_REPO = Symbol('USER_REPO');
