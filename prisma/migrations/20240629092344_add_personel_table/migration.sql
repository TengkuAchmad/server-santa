/*
  Warnings:

  - Added the required column `UUID_MP` to the `DataMedis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DataMedis` ADD COLUMN `UUID_MP` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `MedicPersonel` (
    `UUID_MP` VARCHAR(191) NOT NULL,
    `Name_MP` VARCHAR(191) NOT NULL,
    `Role_MP` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`UUID_MP`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataMedis` ADD CONSTRAINT `DataMedis_UUID_MP_fkey` FOREIGN KEY (`UUID_MP`) REFERENCES `MedicPersonel`(`UUID_MP`) ON DELETE RESTRICT ON UPDATE CASCADE;
