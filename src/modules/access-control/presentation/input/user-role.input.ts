import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddRoleToUserInput {
  @Field()
  userId!: string;

  @Field()
  roleId!: string;
}

@InputType()
export class RemoveRoleFromUserInput {
  @Field()
  userId!: string;

  @Field()
  roleId!: string;
}

@InputType()
export class RemoveAllRolesFromUserInput {
  @Field()
  userId!: string;
}

@InputType()
export class RemoveRoleFromAllUsersInput {
  @Field()
  roleId!: string;
}
