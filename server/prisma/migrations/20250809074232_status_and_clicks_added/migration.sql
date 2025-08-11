-- AlterTable
ALTER TABLE `urls` ADD COLUMN `click` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `status` ENUM('Active', 'InActive') NOT NULL DEFAULT 'Active';
