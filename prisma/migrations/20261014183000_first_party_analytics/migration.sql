-- CreateTable
CREATE TABLE `AnalyticsVisitor` (
    `id` VARCHAR(36) NOT NULL,
    `firstSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sessionCount` INTEGER NOT NULL DEFAULT 0,

    INDEX `AnalyticsVisitor_firstSeenAt_idx`(`firstSeenAt`),
    INDEX `AnalyticsVisitor_lastSeenAt_idx`(`lastSeenAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnalyticsSession` (
    `id` VARCHAR(36) NOT NULL,
    `visitorId` VARCHAR(36) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `activeDurationMs` INTEGER NOT NULL DEFAULT 0,
    `pageViewCount` INTEGER NOT NULL DEFAULT 0,
    `eventCount` INTEGER NOT NULL DEFAULT 0,
    `engaged` BOOLEAN NOT NULL DEFAULT false,
    `landingPage` VARCHAR(768) NOT NULL,
    `exitPage` VARCHAR(768) NULL,
    `currentPage` VARCHAR(768) NOT NULL,
    `currentPageViewId` VARCHAR(36) NULL,
    `previousPage` VARCHAR(768) NULL,
    `currentGameId` INTEGER NULL,
    `currentGameSlug` VARCHAR(128) NULL,
    `referrer` VARCHAR(768) NULL,
    `sourceCategory` VARCHAR(32) NOT NULL DEFAULT 'direct',
    `source` VARCHAR(128) NULL,
    `medium` VARCHAR(128) NULL,
    `campaign` VARCHAR(255) NULL,
    `term` VARCHAR(255) NULL,
    `content` VARCHAR(255) NULL,
    `country` CHAR(2) NULL,
    `deviceType` VARCHAR(16) NOT NULL DEFAULT 'unknown',
    `browser` VARCHAR(64) NOT NULL DEFAULT 'Unknown',
    `operatingSystem` VARCHAR(64) NOT NULL DEFAULT 'Unknown',
    `screenWidth` INTEGER NULL,
    `screenHeight` INTEGER NULL,

    INDEX `AnalyticsSession_visitorId_startedAt_idx`(`visitorId`, `startedAt`),
    INDEX `AnalyticsSession_startedAt_idx`(`startedAt`),
    INDEX `AnalyticsSession_lastSeenAt_idx`(`lastSeenAt`),
    INDEX `AnalyticsSession_currentPageViewId_idx`(`currentPageViewId`),
    INDEX `AnalyticsSession_sourceCategory_startedAt_idx`(`sourceCategory`, `startedAt`),
    INDEX `AnalyticsSession_country_startedAt_idx`(`country`, `startedAt`),
    INDEX `AnalyticsSession_deviceType_startedAt_idx`(`deviceType`, `startedAt`),
    INDEX `AnalyticsSession_browser_startedAt_idx`(`browser`, `startedAt`),
    INDEX `AnalyticsSession_landingPage_startedAt_idx`(`landingPage`(191), `startedAt`),
    INDEX `AnalyticsSession_exitPage_startedAt_idx`(`exitPage`(191), `startedAt`),
    INDEX `AnalyticsSession_currentGameId_lastSeenAt_idx`(`currentGameId`, `lastSeenAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnalyticsPageView` (
    `id` VARCHAR(36) NOT NULL,
    `sessionId` VARCHAR(36) NOT NULL,
    `visitorId` VARCHAR(36) NOT NULL,
    `path` VARCHAR(768) NOT NULL,
    `title` VARCHAR(512) NULL,
    `referrer` VARCHAR(768) NULL,
    `previousPath` VARCHAR(768) NULL,
    `nextPath` VARCHAR(768) NULL,
    `gameId` INTEGER NULL,
    `gameSlug` VARCHAR(128) NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `activeDurationMs` INTEGER NOT NULL DEFAULT 0,
    `isEntrance` BOOLEAN NOT NULL DEFAULT false,
    `isExit` BOOLEAN NOT NULL DEFAULT true,
    `loadTimeMs` INTEGER NULL,
    `domContentLoadedMs` INTEGER NULL,
    `firstContentfulMs` INTEGER NULL,
    `largestContentfulMs` INTEGER NULL,
    `cumulativeLayoutShift` DOUBLE NULL,
    `interactionNextPaintMs` INTEGER NULL,

    INDEX `AnalyticsPageView_sessionId_startedAt_idx`(`sessionId`, `startedAt`),
    INDEX `AnalyticsPageView_visitorId_startedAt_idx`(`visitorId`, `startedAt`),
    INDEX `AnalyticsPageView_path_startedAt_idx`(`path`(191), `startedAt`),
    INDEX `AnalyticsPageView_gameId_startedAt_idx`(`gameId`, `startedAt`),
    INDEX `AnalyticsPageView_isEntrance_startedAt_idx`(`isEntrance`, `startedAt`),
    INDEX `AnalyticsPageView_isExit_startedAt_idx`(`isExit`, `startedAt`),
    INDEX `AnalyticsPageView_startedAt_idx`(`startedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnalyticsEvent` (
    `id` VARCHAR(36) NOT NULL,
    `sessionId` VARCHAR(36) NOT NULL,
    `visitorId` VARCHAR(36) NOT NULL,
    `pageViewId` VARCHAR(36) NULL,
    `eventName` VARCHAR(64) NOT NULL,
    `pagePath` VARCHAR(768) NOT NULL,
    `gameId` INTEGER NULL,
    `gameSlug` VARCHAR(128) NULL,
    `durationMs` INTEGER NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AnalyticsEvent_eventName_createdAt_idx`(`eventName`, `createdAt`),
    INDEX `AnalyticsEvent_sessionId_createdAt_idx`(`sessionId`, `createdAt`),
    INDEX `AnalyticsEvent_visitorId_createdAt_idx`(`visitorId`, `createdAt`),
    INDEX `AnalyticsEvent_gameId_createdAt_idx`(`gameId`, `createdAt`),
    INDEX `AnalyticsEvent_pagePath_createdAt_idx`(`pagePath`(191), `createdAt`),
    INDEX `AnalyticsEvent_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AnalyticsSession`
    ADD CONSTRAINT `AnalyticsSession_visitorId_fkey`
    FOREIGN KEY (`visitorId`) REFERENCES `AnalyticsVisitor`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnalyticsPageView`
    ADD CONSTRAINT `AnalyticsPageView_sessionId_fkey`
    FOREIGN KEY (`sessionId`) REFERENCES `AnalyticsSession`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnalyticsEvent`
    ADD CONSTRAINT `AnalyticsEvent_sessionId_fkey`
    FOREIGN KEY (`sessionId`) REFERENCES `AnalyticsSession`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
