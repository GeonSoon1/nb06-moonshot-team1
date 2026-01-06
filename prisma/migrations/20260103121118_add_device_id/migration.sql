/*
  Warnings:

  - A unique constraint covering the columns `[userId,deviceIdHash]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceIdHash` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "deviceIdHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_deviceIdHash_key" ON "Session"("userId", "deviceIdHash");
