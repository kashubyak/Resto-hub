/*
  Warnings:

  - Added the required column `avatar_url` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'FINISHED';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT NOT NULL;
