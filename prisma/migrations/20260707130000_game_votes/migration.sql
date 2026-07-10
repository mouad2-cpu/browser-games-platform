-- CreateTable
CREATE TABLE `GameVote` (
    `id` VARCHAR(191) NOT NULL,
    `gameId` INTEGER NOT NULL,
    `vote` ENUM('LIKE', 'DISLIKE') NOT NULL,
    `voterId` VARCHAR(128) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GameVote_gameId_idx`(`gameId`),
    UNIQUE INDEX `GameVote_gameId_voterId_key`(`gameId`, `voterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameVote` ADD CONSTRAINT `GameVote_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
