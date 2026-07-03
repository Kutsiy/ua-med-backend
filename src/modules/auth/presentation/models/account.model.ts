import { OAuthAccount } from '@common/generated/prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Account implements OAuthAccount {
  @Field()
  id!: string;

  @Field()
  provider!: string;

  @Field()
  providerAccountId!: string;

  @Field()
  userId!: string;
}
