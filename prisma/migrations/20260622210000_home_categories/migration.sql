-- AlterTable
ALTER TABLE `Category` ADD COLUMN `showOnHome` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `homeLabel` VARCHAR(256) NULL,
    ADD COLUMN `homeSize` VARCHAR(8) NOT NULL DEFAULT 'md',
    ADD COLUMN `homeSortOrder` INTEGER NOT NULL DEFAULT 0;

UPDATE `Category` SET `homeSortOrder` = `sortOrder`, `showOnHome` = true;
