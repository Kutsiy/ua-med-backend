import { Field, ObjectType, ID } from '@nestjs/graphql';
import { IRoleOutput } from '../../services';

@ObjectType()
export class Role implements IRoleOutput {
  @Field(() => ID)
  id!: string;

  name!: string;

  description: string | null = null;
}
