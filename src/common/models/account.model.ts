import { Field, ObjectType, ID } from '@nestjs/graphql';
import type { AccountModel } from '@app/common/generated/prisma/models';

@ObjectType()
export class Account implements Pick<
  AccountModel,
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

  myRoles: null = null;

  myBooking: null = null;

  myToken: null = null;
}
