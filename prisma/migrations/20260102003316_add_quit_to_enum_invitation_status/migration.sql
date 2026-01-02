-- AlterEnum
ALTER TYPE "InvitationStatus" ADD VALUE 'QUIT';

-- AlterTable
ALTER TABLE "OAuthAccount" ADD COLUMN     "expiresAt" TIMESTAMP(3);
