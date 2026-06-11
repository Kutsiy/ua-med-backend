/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "bannedAt" DROP NOT NULL,
ALTER COLUMN "lastOnlineAt" DROP NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");
