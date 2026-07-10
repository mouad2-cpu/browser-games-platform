-- Add DMCA Notice menu page
INSERT INTO `MenuPage` (`title`, `slug`, `icon`, `content`, `sortOrder`, `published`, `updatedAt`)
SELECT
  'DMCA Notice',
  'dmca-notice',
  'scale',
  'Digital Millennium Copyright Act notice and takedown procedures for ZenFun Games.',
  5,
  true,
  NOW(3)
WHERE NOT EXISTS (
  SELECT 1 FROM `MenuPage` WHERE `slug` = 'dmca-notice'
);
