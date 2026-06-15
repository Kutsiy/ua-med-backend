import { UserModel } from '@app/common/generated/prisma/models';
import { UserEntity } from '@modules/user/domain';

export class UserMapper {
  static toDomain(user: UserModel): UserEntity {
    return new UserEntity(
      user.id,
      user.firstName,
      user.secondName,
      user.email,
      user.phoneNumber,
      user.createdAt,
      user.deletedAt,
      user.bannedAt,
      user.lastOnlineAt,
    );
  }

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
