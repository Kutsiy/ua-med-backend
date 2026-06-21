import { Field, ObjectType, ID } from '@nestjs/graphql';
import type { UserModel } from '@common/generated/prisma/models';

@ObjectType()
export class User implements Pick<
  UserModel,
  | 'id'
  | 'firstName'
  | 'secondName'
  | 'email'
  | 'phoneNumber'
  | 'createdAt'
  | 'deletedAt'
  | 'bannedAt'
  | 'lastOnlineAt'
> {
  @Field(() => ID)
  id!: string;

  firstName!: string;

  secondName!: string;

  email!: string;

  phoneNumber!: string;

  createdAt: Date = new Date();

  deletedAt: Date | null = null;

  bannedAt: Date | null = null;

  lastOnlineAt: Date | null = null;

  myRoles: string[] | null = null;

  myBooking: string[] | null = null;

  myToken: string | null = null;
}
