-- DropForeignKey
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_categoryId_fkey";

-- AlterTable
ALTER TABLE "dishes" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
