import { IUserRepository, UserEntity } from '@modules/user/domain/index';
import { UserMapper } from '@modules/user/infrastructure';

import { Prisma } from '@common/generated/prisma/client';
import { PrismaService } from '@common/services';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.findAll();
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    this.logger.log(`get user by id = ${id}`);
    return await this.findUniqe({ id });
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    this.logger.log(`get user by email = ${email}`);
    return await this.findUniqe({ email });
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    this.logger.log(`create a user`);
    return await this.create(UserMapper.toObject(user));
  }
  async updateUserByEmail(user: UserEntity): Promise<UserEntity> {
    this.logger.log(`update the user`);
    return await this.update({ email: user.email }, UserMapper.toUpdate(user));
  }
  async deleteUser(id: string): Promise<void> {
    this.logger.log(`delete the user`);
    return await this.delete({ id });
  }

  // * Main methods:

  private async findAll(): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany();
    return users.map((user) => UserMapper.toDomain(user));
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
