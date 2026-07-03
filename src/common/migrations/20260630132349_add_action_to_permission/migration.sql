/*
  Warnings:

  - Changed the type of `action` on the `permissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "action",
ADD COLUMN     "action" "Actions" NOT NULL;
