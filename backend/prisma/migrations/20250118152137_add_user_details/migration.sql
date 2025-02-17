/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `taskHash` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `transactionHash` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `walletAddress` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[task_hash]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wallet_address]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `task_hash` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_userId_fkey`;

-- DropIndex
DROP INDEX `Task_taskHash_idx` ON `Task`;

-- DropIndex
DROP INDEX `Task_taskHash_key` ON `Task`;

-- DropIndex
DROP INDEX `Task_userId_idx` ON `Task`;

-- DropIndex
DROP INDEX `Task_userId_status_priority_idx` ON `Task`;

-- DropIndex
DROP INDEX `User_walletAddress_idx` ON `User`;

-- DropIndex
DROP INDEX `User_walletAddress_key` ON `User`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `completedAt`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `dueDate`,
    DROP COLUMN `taskHash`,
    DROP COLUMN `transactionHash`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `completed_at` DATETIME(3) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `due_date` DATETIME(3) NULL,
    ADD COLUMN `task_hash` VARCHAR(66) NOT NULL,
    ADD COLUMN `transaction_hash` VARCHAR(66) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `createdAt`,
    DROP COLUMN `refreshToken`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `walletAddress`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `refresh_token` TEXT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `wallet_address` VARCHAR(42) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Task_task_hash_key` ON `Task`(`task_hash`);

-- CreateIndex
CREATE INDEX `Task_user_id_idx` ON `Task`(`user_id`);

-- CreateIndex
CREATE INDEX `Task_task_hash_idx` ON `Task`(`task_hash`);

-- CreateIndex
CREATE INDEX `Task_user_id_status_priority_idx` ON `Task`(`user_id`, `status`, `priority`);

-- CreateIndex
CREATE UNIQUE INDEX `User_wallet_address_key` ON `User`(`wallet_address`);

-- CreateIndex
CREATE INDEX `User_wallet_address_idx` ON `User`(`wallet_address`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
