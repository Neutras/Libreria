/*
  Warnings:

  - You are about to drop the column `isSeasonal` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isSeasonal",
ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 5;
