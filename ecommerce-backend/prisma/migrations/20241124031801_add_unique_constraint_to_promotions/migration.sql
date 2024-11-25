/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Promotion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Promotion_productId_key" ON "Promotion"("productId");
