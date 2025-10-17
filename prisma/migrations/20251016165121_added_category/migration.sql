/*
  Warnings:

  - You are about to drop the column `category` on the `posts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Editing', 'Voiceover', 'Design', 'Drawing', 'Fixing', 'Music');

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "category",
ADD COLUMN     "Category" "Category" NOT NULL DEFAULT 'Editing';
