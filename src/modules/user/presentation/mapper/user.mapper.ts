import { UserModel } from '@common/generated/prisma/models';
import { User } from '@modules/user/presentation';

export class UserMapper {
  static toOutput(user: UserModel): User {
    return {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      middleName: user.middleName,
      birthDate: user.birthDate,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      bannedAt: user.bannedAt,
      lastOnlineAt: user.lastOnlineAt,
      //   myRoles: null,
      //   myBooking: null,
      //   myToken: null,
    };
  }
}
