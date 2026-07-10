-- Game model rewrite: Int IDs, embedPath/thumbnail, GameCategory, GameStatus draft/published

SET FOREIGN_KEY_CHECKS = 0;

-- Clear game-related rows (dev data will be re-seeded)
DELETE FROM `PlayEvent`;
DELETE FROM `GameReport` WHERE `gameId` IS NOT NULL;

DROP TABLE IF EXISTS `GameOnCategory`;
DROP TABLE IF EXISTS `Game`;
DROP TABLE IF EXISTS `Category`;

-- GameUpload: rename embed/thumbnail columns
ALTER TABLE `GameUpload`
  CHANGE COLUMN `embedUrl` `embedPath` VARCHAR(512) NOT NULL,
  CHANGE COLUMN `thumbnailUrl` `thumbnail` VARCHAR(512) NULL;

-- PlayEvent: gameId String -> Int
ALTER TABLE `PlayEvent` DROP FOREIGN KEY `PlayEvent_gameId_fkey`;
ALTER TABLE `PlayEvent` MODIFY `gameId` INTEGER NOT NULL;

-- GameReport: gameId String -> Int (nullable)
ALTER TABLE `GameReport` DROP FOREIGN KEY `GameReport_gameId_fkey`;
ALTER TABLE `GameReport` MODIFY `gameId` INTEGER NULL;

CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(128) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(128) NOT NULL,
    `title` VARCHAR(256) NOT NULL,
    `embedPath` VARCHAR(512) NULL,
    `thumbnail` VARCHAR(512) NULL,
    `description` TEXT NULL,
    `metaTitle` VARCHAR(256) NULL,
    `metaDescription` VARCHAR(512) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `releasedAt` DATETIME(3) NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `primaryCategoryId` INTEGER NULL,
    `addedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Game_slug_key`(`slug`),
    INDEX `Game_status_featured_idx`(`status`, `featured`),
    INDEX `Game_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `Game_primaryCategoryId_idx`(`primaryCategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `GameCategory` (
    `gameId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`gameId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Game` ADD CONSTRAINT `Game_primaryCategoryId_fkey` FOREIGN KEY (`primaryCategoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `GameCategory` ADD CONSTRAINT `GameCategory_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `GameCategory` ADD CONSTRAINT `GameCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `GameReport` ADD CONSTRAINT `GameReport_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `PlayEvent` ADD CONSTRAINT `PlayEvent_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
