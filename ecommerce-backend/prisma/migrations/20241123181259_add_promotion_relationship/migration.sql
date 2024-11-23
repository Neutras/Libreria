/*
  Warnings:

  - Added the required column `updatedAt` to the `OrderProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "OrderProduct" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isHot" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "stock" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
