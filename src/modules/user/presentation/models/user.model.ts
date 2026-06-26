import { Field, ObjectType, ID } from '@nestjs/graphql';
import type { UserModel } from '@common/generated/prisma/models';

@ObjectType()
export class User implements Pick<
  UserModel,
  | 'id'
  | 'firstName'
  | 'secondName'
  | 'middleName'
  | 'email'
  | 'phoneNumber'
  | 'createdAt'
  | 'deletedAt'
  | 'bannedAt'
  | 'lastOnlineAt'
  | 'isActive'
  | 'activationLink'
> {
  @Field(() => ID)
  id!: string;

  firstName!: string;

  secondName!: string;

  middleName!: string | null;

  birthDate: Date | null = null;

  email!: string;

  phoneNumber!: string | null;

  createdAt: Date = new Date();

  deletedAt: Date | null = null;

  bannedAt: Date | null = null;

  lastOnlineAt: Date | null = null;

  isActive!: boolean;

  activationLink!: string | null;

  // myRoles: string[] | null = null;

  // myBooking: string[] | null = null;

  // myToken: string | null = null;
}
