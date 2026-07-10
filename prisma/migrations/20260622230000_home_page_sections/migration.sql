-- CreateTable
CREATE TABLE `HomePageSection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `title` VARCHAR(256) NULL,
    `layout` VARCHAR(16) NOT NULL DEFAULT 'row',
    `gameLimit` INTEGER NOT NULL DEFAULT 14,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `HomePageSection_categoryId_key`(`categoryId`),
    INDEX `HomePageSection_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `HomePageSection` ADD CONSTRAINT `HomePageSection_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
