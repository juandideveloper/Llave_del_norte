/*
  Warnings:

  - You are about to drop the column `productoId` on the `Resena` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clienteId,alegraProductoId]` on the table `Resena` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alegraProductoId` to the `Resena` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Resena" DROP CONSTRAINT "Resena_productoId_fkey";

-- AlterTable
ALTER TABLE "Resena" DROP COLUMN "productoId",
ADD COLUMN     "alegraProductoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Resena_clienteId_alegraProductoId_key" ON "Resena"("clienteId", "alegraProductoId");
