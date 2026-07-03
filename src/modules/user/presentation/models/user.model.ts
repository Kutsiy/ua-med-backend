import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
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
}
