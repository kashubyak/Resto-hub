/*
  Warnings:

  - A unique constraint covering the columns `[subdomain]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subdomain` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "subdomain" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_subdomain_key" ON "companies"("subdomain");
