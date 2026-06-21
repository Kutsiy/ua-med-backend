import { UserEntity } from '@modules/user/domain';

export class UserMapper {
  static toOutput(user: UserEntity) {
    return {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      bannedAt: user.bannedAt,
      lastOnlineAt: user.lastOnlineAt,
    };
  }
}
