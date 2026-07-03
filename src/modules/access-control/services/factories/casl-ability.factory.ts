import { Injectable } from '@nestjs/common';
import { AbilityBuilder, ExtractSubjectType } from '@casl/ability';
import { createPrismaAbility, PrismaAbility, Subjects } from '@casl/prisma';
import { User } from '@common/generated/prisma/client';
import { IAbilityPermission } from '../input';

export const Actions = {
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
} as const;

export type Actions = (typeof Actions)[keyof typeof Actions];

const appSubjects = {
  user: {} as User,
} as const;

type SubjectName = keyof typeof appSubjects;

type AppPrismaSubject = Subjects<typeof appSubjects>;

type Resource = 'all' | SubjectName;

export type AppAbility = PrismaAbility<[Actions, Resource | AppPrismaSubject]>;

function isAppResource(value: string): value is Resource {
  return value === 'all' || value in appSubjects;
}

function isAction(value: string): value is Actions {
  return Object.values(Actions).includes(value as Actions);
}

@Injectable()
export class CaslAbilityFactory {
  defineAbility(permissions: IAbilityPermission[]): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    for (const permission of permissions) {
      if (!isAction(permission.action) || !isAppResource(permission.resource)) {
        continue;
      }

      can(permission.action, permission.resource);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<AppPrismaSubject>,
    });
  }
}
