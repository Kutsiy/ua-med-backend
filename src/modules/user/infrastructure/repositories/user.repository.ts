import { IUserRepository, UserEntity } from '@modules/user/domain/index';
import { UserMapper } from '@modules/user/infrastructure';

import { Prisma } from '@common/generated/prisma/client';
import { PrismaService } from '@common/services';

export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(id: string): Promise<UserEntity | null> {
    return await this.findUniqe({ id });
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.findUniqe({ email });
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    return await this.create(user);
  }
  async updateUserByEmail(user: UserEntity): Promise<UserEntity> {
    return await this.update({ email: user.email }, user);
  }
  async deleteUser(id: string): Promise<void> {
    return await this.delete({ id });
  }

  private async findUniqe(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  private async create(userCreateInput: Prisma.UserCreateInput): Promise<UserEntity> {
    const user = await this.prismaService.user.create({
      data: userCreateInput,
    });
    return UserMapper.toDomain(user);
  }

  private async update(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    userUpdateInput: Prisma.UserUpdateInput,
  ): Promise<UserEntity> {
    const user = await this.prismaService.user.update({
      data: userUpdateInput,
      where: userWhereUniqueInput,
    });
    return UserMapper.toDomain(user);
  }

  private async delete(userWhereInput: Prisma.UserWhereUniqueInput): Promise<void> {
    await this.prismaService.user.delete({
      where: userWhereInput,
    });
    return;
  }
}
