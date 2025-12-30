/*
  Warnings:

  - You are about to drop the column `InvitationId` on the `Invitation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "InvitationId",
ADD COLUMN     "invitationId" TEXT;
