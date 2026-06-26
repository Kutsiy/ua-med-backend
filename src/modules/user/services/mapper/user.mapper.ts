import { UserEntity } from '@modules/user/domain';
import { type ClassFields } from '@utils';

export class UserMapper {
  static toOutput(user: UserEntity): ClassFields<UserEntity> {
    return {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      middleName: user.middleName,
      birthDate: user.birthDate,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      passLink: user.passLink,
      passLinkExpAt: user.passLinkExpAt,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      bannedAt: user.bannedAt,
      lastOnlineAt: user.lastOnlineAt,
      activationLink: user.activationLink,
      isActive: user.isActive,
    };
  }
}
