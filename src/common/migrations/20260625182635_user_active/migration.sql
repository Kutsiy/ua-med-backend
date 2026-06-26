/*
  Warnings:

  - A unique constraint covering the columns `[activationLink]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - The required column `activationLink` was added to the `user` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `isActive` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "activationLink" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_activationLink_key" ON "user"("activationLink");
