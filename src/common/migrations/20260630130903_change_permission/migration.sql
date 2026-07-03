/*
  Warnings:

  - Added the required column `action` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourse` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "resourse" TEXT NOT NULL;
