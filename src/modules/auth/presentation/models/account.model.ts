import { Field, ObjectType } from '@nestjs/graphql';
import { IAccountsOutput } from '../../services/outputs';

@ObjectType()
export class Account implements IAccountsOutput {
  @Field()
  id!: string;

  @Field()
  provider!: string;

  @Field()
  providerAccountId!: string;

  @Field()
  userId!: string;
}
