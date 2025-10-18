-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACCEPT', 'REVIEW', 'DECLINE');

-- AlterTable
ALTER TABLE "commands" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACCEPT';
