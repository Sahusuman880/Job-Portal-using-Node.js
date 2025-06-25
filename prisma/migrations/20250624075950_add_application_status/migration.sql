/*
  Warnings:

  - A unique constraint covering the columns `[userId,jobId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resumeUrl` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `application` ADD COLUMN `resumeUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `Application_userId_jobId_key` ON `Application`(`userId`, `jobId`);
