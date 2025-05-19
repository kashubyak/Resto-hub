-- AlterTable
ALTER TABLE "dishes" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "weightGr" INTEGER;
