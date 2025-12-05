/*
  Warnings:

  - You are about to drop the column `Category` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "Category",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'Editing';
