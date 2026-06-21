import { UserModel } from '@common/generated/prisma/models';
import { UserEntity } from '@modules/user/domain';
import { Prisma } from '@common/generated/prisma/client';

export class UserMapper {
  static toDomain(user: UserModel): UserEntity {
    return new UserEntity(
      user.id,
      user.firstName,
      user.secondName,
      user.middleName,
      user.email,
      user.phoneNumber,
      user.createdAt,
      user.deletedAt,
      user.bannedAt,
      user.lastOnlineAt,
    );
  }

  static toObject(user: UserEntity) {
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

  static toUpdate(user: UserEntity): Prisma.UserUpdateInput {
    return {
      firstName: user.firstName,
      secondName: user.secondName,
      phoneNumber: user.phoneNumber,
      deletedAt: user.deletedAt,
      bannedAt: user.bannedAt,
      lastOnlineAt: user.lastOnlineAt,
    };
  }
}
