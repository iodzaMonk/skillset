-- DropForeignKey
ALTER TABLE "public"."commands" DROP CONSTRAINT "commands_client_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."commands" DROP CONSTRAINT "commands_prof_id_fkey";

-- AddForeignKey
ALTER TABLE "commands" ADD CONSTRAINT "commands_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commands" ADD CONSTRAINT "commands_prof_id_fkey" FOREIGN KEY ("prof_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
