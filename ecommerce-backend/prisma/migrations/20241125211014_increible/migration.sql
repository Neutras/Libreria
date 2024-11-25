/*
  Warnings:

  - Made the column `productId` on table `Alert` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Alert" ALTER COLUMN "productId" SET NOT NULL;
