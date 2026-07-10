-- Map old placement values to clearer between/first/last names
UPDATE `HomePageSection` SET `placement` = 'between_continue_top_picks' WHERE `placement` = 'after_continue';
UPDATE `HomePageSection` SET `placement` = 'between_top_picks_featured' WHERE `placement` = 'after_top_picks';
UPDATE `HomePageSection` SET `placement` = 'between_featured_latest' WHERE `placement` IN ('after_featured', 'before_latest');

UPDATE `Category` SET `homePlacement` = 'between_continue_top_picks' WHERE `homePlacement` = 'after_continue';
UPDATE `Category` SET `homePlacement` = 'between_top_picks_featured' WHERE `homePlacement` = 'after_top_picks';
UPDATE `Category` SET `homePlacement` = 'between_featured_latest' WHERE `homePlacement` IN ('after_featured', 'before_latest');

ALTER TABLE `HomePageSection` ALTER COLUMN `placement` SET DEFAULT 'between_top_picks_featured';
ALTER TABLE `Category` ALTER COLUMN `homePlacement` SET DEFAULT 'between_featured_latest';
