import 'dotenv/config';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const Actions = {
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
} as const;

const Resources = {
  User: 'user',
  Role: 'role',
  Permission: 'permission',
  Pharmacy: 'pharmacy',
} as const;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function assignPermissionToRole(roleId: string, permissionId: string) {
  return prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId,
      },
    },
    update: {},
    create: {
      roleId,
      permissionId,
    },
  });
}

async function main() {
  const userRole = await prisma.role.upsert({
    where: {
      name: 'USER',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'USER',
      description: 'Role for users',
    },
  });

  const pharmacyRole = await prisma.role.upsert({
    where: {
      name: 'PHARMACY',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'PHARMACY',
      description: 'Role for pharmacy',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: {
      name: 'ADMIN',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'ADMIN',
      description: 'Role for admins',
    },
  });

  const userReadPermission = await prisma.permission.upsert({
    where: {
      name: 'user:read',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'user:read',
      action: Actions.Read,
      resource: Resources.User,
      description: 'Can read users',
    },
  });

  const userCreatePermission = await prisma.permission.upsert({
    where: {
      name: 'user:create',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'user:create',
      action: Actions.Create,
      resource: Resources.User,
      description: 'Can create users',
    },
  });

  const userUpdatePermission = await prisma.permission.upsert({
    where: {
      name: 'user:update',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'user:update',
      action: Actions.Update,
      resource: Resources.User,
      description: 'Can update users',
    },
  });

  const userDeletePermission = await prisma.permission.upsert({
    where: {
      name: 'user:delete',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'user:delete',
      action: Actions.Delete,
      resource: Resources.User,
      description: 'Can delete users',
    },
  });

  const roleManagePermission = await prisma.permission.upsert({
    where: {
      name: 'role:manage',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'role:manage',
      action: Actions.Manage,
      resource: Resources.Role,
      description: 'Can manage roles',
    },
  });

  const permissionManagePermission = await prisma.permission.upsert({
    where: {
      name: 'permission:manage',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'permission:manage',
      action: Actions.Manage,
      resource: Resources.Permission,
      description: 'Can manage permissions',
    },
  });

  const pharmacyReadPermission = await prisma.permission.upsert({
    where: {
      name: 'pharmacy:read',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'pharmacy:read',
      action: Actions.Read,
      resource: Resources.Pharmacy,
      description: 'Can read pharmacies',
    },
  });

  const pharmacyCreatePermission = await prisma.permission.upsert({
    where: {
      name: 'pharmacy:create',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'pharmacy:create',
      action: Actions.Create,
      resource: Resources.Pharmacy,
      description: 'Can create pharmacies',
    },
  });

  const pharmacyUpdatePermission = await prisma.permission.upsert({
    where: {
      name: 'pharmacy:update',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'pharmacy:update',
      action: Actions.Update,
      resource: Resources.Pharmacy,
      description: 'Can update pharmacies',
    },
  });

  const pharmacyDeletePermission = await prisma.permission.upsert({
    where: {
      name: 'pharmacy:delete',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'pharmacy:delete',
      action: Actions.Delete,
      resource: Resources.Pharmacy,
      description: 'Can delete pharmacies',
    },
  });

  const pharmacyManagePermission = await prisma.permission.upsert({
    where: {
      name: 'pharmacy:manage',
    },
    update: {},
    create: {
      id: randomUUID(),
      name: 'pharmacy:manage',
      action: Actions.Manage,
      resource: Resources.Pharmacy,
      description: 'Can manage pharmacies',
    },
  });

  await Promise.all([
    assignPermissionToRole(userRole.id, userReadPermission.id),
    assignPermissionToRole(userRole.id, pharmacyReadPermission.id),

    assignPermissionToRole(pharmacyRole.id, pharmacyReadPermission.id),
    assignPermissionToRole(pharmacyRole.id, pharmacyCreatePermission.id),
    assignPermissionToRole(pharmacyRole.id, pharmacyUpdatePermission.id),

    assignPermissionToRole(adminRole.id, userReadPermission.id),
    assignPermissionToRole(adminRole.id, userCreatePermission.id),
    assignPermissionToRole(adminRole.id, userUpdatePermission.id),
    assignPermissionToRole(adminRole.id, userDeletePermission.id),

    assignPermissionToRole(adminRole.id, roleManagePermission.id),
    assignPermissionToRole(adminRole.id, permissionManagePermission.id),

    assignPermissionToRole(adminRole.id, pharmacyReadPermission.id),
    assignPermissionToRole(adminRole.id, pharmacyCreatePermission.id),
    assignPermissionToRole(adminRole.id, pharmacyUpdatePermission.id),
    assignPermissionToRole(adminRole.id, pharmacyDeletePermission.id),
    assignPermissionToRole(adminRole.id, pharmacyManagePermission.id),
  ]);

  console.log('Seed completed successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
