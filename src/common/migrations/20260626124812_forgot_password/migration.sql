/*
  Warnings:

  - A unique constraint covering the columns `[passLink]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "passLink" TEXT,
ADD COLUMN     "passLinkExpAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "user_passLink_key" ON "user"("passLink");
