/*
  Warnings:

  - The primary key for the `Invitation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `invitationId` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccountId` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `OAuthAccount` table. All the data in the column will be lost.
  - You are about to drop the column `inviteId` on the `ProjectMember` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerId]` on the table `OAuthAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invitationId]` on the table `ProjectMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessTokenHashed` to the `OAuthAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `OAuthAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProjectMember" DROP CONSTRAINT "ProjectMember_inviteId_fkey";

-- DropIndex
DROP INDEX "public"."Invitation_invitationId_key";

-- DropIndex
DROP INDEX "public"."OAuthAccount_provider_providerAccountId_key";

-- DropIndex
DROP INDEX "public"."ProjectMember_inviteId_key";

-- AlterTable
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_pkey",
DROP COLUMN "invitationId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Invitation_id_seq";

-- AlterTable
ALTER TABLE "OAuthAccount" DROP COLUMN "accessToken",
DROP COLUMN "expiresAt",
DROP COLUMN "providerAccountId",
DROP COLUMN "refreshToken",
ADD COLUMN     "accessTokenHashed" TEXT NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "refreshTokenEncrypted" TEXT;

-- AlterTable
ALTER TABLE "ProjectMember" DROP COLUMN "inviteId",
ADD COLUMN     "invitationId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHash",
ADD COLUMN     "passwordHashed" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccount_provider_providerId_key" ON "OAuthAccount"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_invitationId_key" ON "ProjectMember"("invitationId");

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
