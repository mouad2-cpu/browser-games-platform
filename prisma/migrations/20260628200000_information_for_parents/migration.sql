-- Add Information for Parents menu page
INSERT INTO `MenuPage` (`title`, `slug`, `icon`, `content`, `sortOrder`, `published`, `updatedAt`)
SELECT
  'Information for Parents',
  'information-for-parents',
  'users',
  'Guidance for parents about safe, family-friendly gaming on ZenFun Games.',
  4,
  true,
  NOW(3)
WHERE NOT EXISTS (
  SELECT 1 FROM `MenuPage` WHERE `slug` = 'information-for-parents'
);
