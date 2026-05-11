/*
  Warnings:

  - The values [PSE] on the enum `MetodoPago` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MetodoPago_new" AS ENUM ('BOLD', 'CONTRAENTREGA');
ALTER TABLE "Pedido" ALTER COLUMN "metodoPago" TYPE "MetodoPago_new" USING ("metodoPago"::text::"MetodoPago_new");
ALTER TYPE "MetodoPago" RENAME TO "MetodoPago_old";
ALTER TYPE "MetodoPago_new" RENAME TO "MetodoPago";
DROP TYPE "MetodoPago_old";
COMMIT;
