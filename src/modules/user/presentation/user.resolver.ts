import { Resolver } from '@nestjs/graphql';
import { User } from '@common/models';

@Resolver(() => User)
export class UsersResolver {}
