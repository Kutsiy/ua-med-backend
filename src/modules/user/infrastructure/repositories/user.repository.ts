import { Injectable, Logger } from '@nestjs/common';
import { IUserRepository, UserEntity, UserWhere } from '@modules/user/domain';
import { UserMapper } from '@modules/user/infrastructure';
import { PrismaService } from '@common/services';
import { withPrismaErrorHandling } from '@common/utils';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getUserWhere(userWhere: UserWhere): Promise<UserEntity | null> {
    return withPrismaErrorHandling(async () => {
      const user = await this.prismaService.user.findFirst({
        where: userWhere,
      });
      return user ? UserMapper.toDomain(user) : null;
    }, 'getUserWhere');
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return withPrismaErrorHandling(async () => {
      const users = await this.prismaService.user.findMany();
      return users.map((user) => UserMapper.toDomain(user));
    }, 'getAllUsers');
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    this.logger.log(`Get user by id = ${id}`);

    return withPrismaErrorHandling(async () => {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });
      return user ? UserMapper.toDomain(user) : null;
    }, 'getUserById');
  }

  async getUserByActivationLink(activationLink: string): Promise<UserEntity | null> {
    this.logger.log(`Get user by activationLink = ${activationLink}`);

    return withPrismaErrorHandling(async () => {
      const user = await this.prismaService.user.findUnique({
        where: { activationLink },
      });
      return user ? UserMapper.toDomain(user) : null;
    }, 'getUserByActivationLink');
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    this.logger.log(`Get user by email = ${email}`);

    return withPrismaErrorHandling(async () => {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      return user ? UserMapper.toDomain(user) : null;
    }, 'getUserByEmail');
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    this.logger.log('Create user');

    return withPrismaErrorHandling(async () => {
      const createdUser = await this.prismaService.user.create({
        data: UserMapper.toObject(user),
      });
      return UserMapper.toDomain(createdUser);
    }, 'createUser');
  }

  async updateUserByEmail(user: UserEntity): Promise<UserEntity> {
    this.logger.log(`Update user by email = ${user.email}`);

    return withPrismaErrorHandling(async () => {
      const updatedUser = await this.prismaService.user.update({
        where: { email: user.email },
        data: UserMapper.toUpdate(user),
      });
      return UserMapper.toDomain(updatedUser);
    }, 'updateUserByEmail');
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.log(`Delete user by id = ${id}`);

    await withPrismaErrorHandling(async () => {
      await this.prismaService.user.delete({
        where: { id },
      });
    }, 'deleteUser');
  }
}
