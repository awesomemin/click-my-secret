/*
  Warnings:

  - The primary key for the `Click` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Secret` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_secretId_fkey";

-- AlterTable
ALTER TABLE "Click" DROP CONSTRAINT "Click_pkey",
ALTER COLUMN "secretId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Click_pkey" PRIMARY KEY ("secretId", "userId");

-- AlterTable
ALTER TABLE "Secret" DROP CONSTRAINT "Secret_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Secret_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_secretId_fkey" FOREIGN KEY ("secretId") REFERENCES "Secret"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
