/*
  Warnings:

  - Added the required column `BirthDate_UA` to the `UserAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserAccount` ADD COLUMN `BirthDate_UA` DATETIME(3) NOT NULL;
