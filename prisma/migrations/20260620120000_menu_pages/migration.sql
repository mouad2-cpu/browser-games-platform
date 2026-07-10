-- CreateTable
CREATE TABLE `MenuPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(256) NOT NULL,
    `slug` VARCHAR(128) NOT NULL,
    `icon` VARCHAR(64) NULL,
    `content` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MenuPage_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `MenuPage` (`title`, `slug`, `icon`, `content`, `sortOrder`, `published`, `updatedAt`) VALUES
('Contact Us', 'contact', 'mail', 'Have a question, feedback, or need help with a game? We would love to hear from you.\n\nEmail us at support@zenfungames.com\n\nWe usually reply within 1–2 business days.', 1, true, NOW(3)),
('Terms of Service', 'terms', 'scale', 'Last updated: June 2026\n\nBy using ZenFun Games, you agree to these terms. Please read them carefully before playing or browsing our site.\n\nUsing our service\nYou may use ZenFun Games for personal, non-commercial entertainment. Do not attempt to disrupt the site, abuse other users, or upload harmful content.', 2, true, NOW(3)),
('Privacy Policy', 'privacy', 'shield', 'Last updated: June 2026\n\nZenFun Games respects your privacy. This policy explains what information we collect and how we use it.\n\nInformation we collect\nWe may collect basic usage data such as pages visited, games played, and cookies used to remember recently played games.', 3, true, NOW(3));
