/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `OAuthAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OAuthAccount" DROP COLUMN "expiresAt";
