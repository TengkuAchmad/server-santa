/*
  Warnings:

  - You are about to drop the column `Status_TC` on the `Ticketing` table. All the data in the column will be lost.
  - Added the required column `isCancelled_TC` to the `Ticketing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDone_TC` to the `Ticketing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isWaiting_TC` to the `Ticketing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ticketing` DROP COLUMN `Status_TC`,
    ADD COLUMN `isCancelled_TC` BOOLEAN NOT NULL,
    ADD COLUMN `isDone_TC` BOOLEAN NOT NULL,
    ADD COLUMN `isWaiting_TC` BOOLEAN NOT NULL;
