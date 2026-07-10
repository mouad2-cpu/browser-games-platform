-- CreateTable
CREATE TABLE `UserGameProgress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `gameId` INTEGER NOT NULL,
    `lastPlayedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `progressData` TEXT NULL,

    UNIQUE INDEX `UserGameProgress_userId_gameId_key`(`userId`, `gameId`),
    INDEX `UserGameProgress_userId_lastPlayedAt_idx`(`userId`, `lastPlayedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserGameProgress` ADD CONSTRAINT `UserGameProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGameProgress` ADD CONSTRAINT `UserGameProgress_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
