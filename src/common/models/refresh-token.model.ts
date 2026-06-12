import { Field, ObjectType, ID } from '@nestjs/graphql';
import type { RefreshTokenModel } from '@app/common/generated/prisma/models';

@ObjectType()
export class RefreshToken implements Pick<
  RefreshTokenModel,
  'id' | 'token' | 'expiresAt' | 'expired'
> {
  @Field(() => ID)
  id!: string;

  token!: string;

  expiresAt!: Date;

  expired!: boolean;
}
