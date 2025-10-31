/*
  Warnings:

  - You are about to alter the column `rating` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "rating" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "rating" SMALLINT;
