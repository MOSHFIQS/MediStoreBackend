/*
  Warnings:

  - You are about to drop the column `requiresPrescription` on the `medicines` table. All the data in the column will be lost.
  - You are about to drop the `prescription_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prescription_items" DROP CONSTRAINT "prescription_items_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "prescription_items" DROP CONSTRAINT "prescription_items_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_userId_fkey";

-- AlterTable
ALTER TABLE "medicines" DROP COLUMN "requiresPrescription";

-- DropTable
DROP TABLE "prescription_items";

-- DropTable
DROP TABLE "prescriptions";
