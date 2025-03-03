-- CreateTable
CREATE TABLE `Club` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Club_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `clubId` INTEGER NULL,
    `mail` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Player_mail_key`(`mail`),
    UNIQUE INDEX `Player_phone_key`(`phone`),
    INDEX `idx_player_clubId`(`clubId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `player1Id` INTEGER NOT NULL,
    `player2Id` INTEGER NULL,
    `strengthId` INTEGER NOT NULL,
    `poolId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_team_player1Id`(`player1Id`),
    INDEX `idx_team_player2Id`(`player2Id`),
    INDEX `idx_team_poolId`(`poolId`),
    INDEX `idx_team_strengthId`(`strengthId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Strength` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Strength_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pool` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `strengthId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_pool_strengthId`(`strengthId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poolId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `courtId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_match_courtId`(`courtId`),
    INDEX `idx_match_poolId`(`poolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamsInMatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,

    INDEX `idx_teamsInMatch_matchId`(`matchId`),
    INDEX `idx_teamsInMatch_teamId`(`teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SetResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `setNumber` INTEGER NOT NULL,
    `team1Score` INTEGER NOT NULL,
    `team2Score` INTEGER NOT NULL,

    INDEX `idx_setResult_matchId`(`matchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Standings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poolId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,
    `matchesPlayed` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `points` INTEGER NOT NULL DEFAULT 0,
    `setsWon` INTEGER NOT NULL DEFAULT 0,
    `setsLost` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Standings_teamId_key`(`teamId`),
    INDEX `idx_standings_poolId`(`poolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Court` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Court_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_player1Id_fkey` FOREIGN KEY (`player1Id`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_player2Id_fkey` FOREIGN KEY (`player2Id`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_strengthId_fkey` FOREIGN KEY (`strengthId`) REFERENCES `Strength`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pool` ADD CONSTRAINT `Pool_strengthId_fkey` FOREIGN KEY (`strengthId`) REFERENCES `Strength`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_courtId_fkey` FOREIGN KEY (`courtId`) REFERENCES `Court`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamsInMatch` ADD CONSTRAINT `TeamsInMatch_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamsInMatch` ADD CONSTRAINT `TeamsInMatch_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SetResult` ADD CONSTRAINT `SetResult_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Standings` ADD CONSTRAINT `Standings_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Standings` ADD CONSTRAINT `Standings_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
