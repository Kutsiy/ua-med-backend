import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RefreshTokenModel } from '@common/generated/prisma/models';

@ObjectType()
export class RefreshToken implements Omit<RefreshTokenModel, 'token'> {
  @Field(() => ID)
  id!: string;

  @Field()
  userId!: string;

  @Field()
  expired!: boolean;

  @Field()
  expiresAt!: Date;

  @Field()
  createdAt!: Date;
}
