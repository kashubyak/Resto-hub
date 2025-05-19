/*
  Warnings:

  - You are about to drop the column `weightGr` on the `dishes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `dishes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "dishes" DROP COLUMN "weightGr",
ADD COLUMN     "weight_gr" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dishes_name_key" ON "dishes"("name");
