/*
  Warnings:

  - You are about to drop the column `notes` on the `interview_evaluations` table. All the data in the column will be lost.
  - Added the required column `feedback` to the `Interview_evaluations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `interview_evaluations` DROP COLUMN `notes`,
    ADD COLUMN `feedback` TEXT NOT NULL;
