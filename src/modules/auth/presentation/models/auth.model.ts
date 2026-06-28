import { Token } from './token.model';
import { User } from '@modules/user';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Auth {
  @Field(() => Token)
  tokens!: Token;

  @Field(() => User)
  user!: User;
}
