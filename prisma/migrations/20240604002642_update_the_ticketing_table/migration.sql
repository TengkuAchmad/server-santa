/*
  Warnings:

  - You are about to drop the column `DateTime_TC` on the `Ticketing` table. All the data in the column will be lost.
  - Added the required column `Date_TC` to the `Ticketing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Time_TC` to the `Ticketing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ticketing` DROP COLUMN `DateTime_TC`,
    ADD COLUMN `Date_TC` VARCHAR(191) NOT NULL,
    ADD COLUMN `Time_TC` VARCHAR(191) NOT NULL;
