-- AlterTable
ALTER TABLE `urls` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `urls` ADD CONSTRAINT `urls_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
