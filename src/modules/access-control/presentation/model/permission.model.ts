import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IPermissionOutput } from '../../services';

@ObjectType()
export class Permission implements IPermissionOutput {
  @Field(() => ID)
  id!: string;

  name!: string;

  description: string | null = null;

  action!: string;

  resource!: string;
}
