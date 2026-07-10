-- AlterTable
ALTER TABLE `HomePageSection` ADD COLUMN `placement` VARCHAR(32) NOT NULL DEFAULT 'after_top_picks';

ALTER TABLE `Category` ADD COLUMN `homePlacement` VARCHAR(32) NOT NULL DEFAULT 'before_latest';
