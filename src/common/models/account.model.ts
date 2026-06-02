import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Account {
  @Field(() => ID)
  id!: string;

  firstName!: string;

  secondName!: string;

  email!: string;

  phoneNumber!: string;

  createdAt: Date | null = null;

  deletedAt: Date | null = null;

  bannedAt: Date | null = null;

  lastOnlineAt: Date | null = null;

  myRoles: null = null;

  myBooking: null = null;

  myToken: null = null;
}
