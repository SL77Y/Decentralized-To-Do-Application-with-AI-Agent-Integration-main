-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `walletAddress` VARCHAR(42) NOT NULL,
    `refreshToken` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_walletAddress_key`(`walletAddress`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_walletAddress_idx`(`walletAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `taskHash` VARCHAR(66) NOT NULL,
    `status` ENUM('IN_PROGRESS', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'IN_PROGRESS',
    `priority` INTEGER NOT NULL DEFAULT 0,
    `transactionHash` VARCHAR(66) NULL,
    `dueDate` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Task_taskHash_key`(`taskHash`),
    INDEX `Task_userId_idx`(`userId`),
    INDEX `Task_taskHash_idx`(`taskHash`),
    INDEX `Task_priority_idx`(`priority`),
    INDEX `Task_status_idx`(`status`),
    INDEX `Task_userId_status_priority_idx`(`userId`, `status`, `priority`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
