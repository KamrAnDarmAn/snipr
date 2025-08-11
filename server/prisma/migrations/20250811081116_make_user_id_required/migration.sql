/*
  Warnings:

  - Made the column `userId` on table `urls` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `urls` DROP FOREIGN KEY `urls_userId_fkey`;

-- DropIndex
DROP INDEX `urls_userId_fkey` ON `urls`;

-- AlterTable
ALTER TABLE `urls` MODIFY `longUrl` VARCHAR(2048) NOT NULL,
    MODIFY `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `urls_shortUrl_idx` ON `urls`(`shortUrl`);

-- AddForeignKey
ALTER TABLE `urls` ADD CONSTRAINT `urls_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
