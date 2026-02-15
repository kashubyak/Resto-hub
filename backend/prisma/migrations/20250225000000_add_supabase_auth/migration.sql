-- AlterTable: add supabase_user_id, remove password, change unique constraint
ALTER TABLE "users" ADD COLUMN "supabase_user_id" TEXT;

-- DropIndex
DROP INDEX "users_email_companyId_key";

-- CreateIndex (nullable supabase_user_id: multiple rows with NULL+companyId allowed)
CREATE UNIQUE INDEX "users_supabaseUserId_companyId_key" ON "users"("supabase_user_id", "companyId");

-- AlterTable: remove password column
ALTER TABLE "users" DROP COLUMN "password";
