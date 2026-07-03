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
      user.birthDate,
      user.email,
      user.phoneNumber,
      user.password,
      user.passLink,
      user.passLinkExpAt,
      user.createdAt,
      user.deletedAt,
      user.bannedAt,
      user.lastOnlineAt,
      user.isActive,
      user.activationLink,
    );
  }

  static toObject(user: UserEntity): UserModel {
    return {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      passLink: user.passLink,
      passLinkExpAt: user.passLinkExpAt,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      bannedAt: user.bannedAt,
      lastOnlineAt: user.lastOnlineAt,
      isActive: user.isActive,
      activationLink: user.activationLink,
      birthDate: user.birthDate,
      middleName: user.middleName,
    };
  }

  static toUpdate(user: UserEntity): Prisma.UserUpdateInput {
    return {
      firstName: user.firstName,
      secondName: user.secondName,
      middleName: user.middleName,
      phoneNumber: user.phoneNumber,
      deletedAt: user.deletedAt,
      bannedAt: user.bannedAt,
      lastOnlineAt: user.lastOnlineAt,
      isActive: user.isActive,
      activationLink: user.activationLink,
      passLink: user.passLink,
      passLinkExpAt: user.passLinkExpAt,
      password: user.password,
    };
  }
}
