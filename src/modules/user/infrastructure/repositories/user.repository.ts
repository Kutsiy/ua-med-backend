import { Injectable } from '@nestjs/common';
import { IUserRepository, UserEntity, UserWhere } from '@modules/user/domain';
import { UserMapper } from '@modules/user/infrastructure';
import { PrismaService } from '@common/services';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserWhere(userWhere: UserWhere): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findFirst({
      where: userWhere,
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        accounts: true,
      },
    });

    return users.map((user) => UserMapper.toDomain(user));
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async getUserByActivationLink(activationLink: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { activationLink },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prismaService.user.create({
      data: UserMapper.toObject(user),
    });

    return UserMapper.toDomain(createdUser);
  }

  async updateUserByEmail(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.prismaService.user.update({
      where: { email: user.email },
      data: UserMapper.toUpdate(user),
    });

    return UserMapper.toDomain(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id },
    });
  }
}
