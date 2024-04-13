/*
  Warnings:

  - You are about to drop the column `logitude` on the `gyms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "logitude",
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL DEFAULT 0;
