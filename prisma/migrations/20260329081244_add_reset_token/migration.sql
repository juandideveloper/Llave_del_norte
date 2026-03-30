-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpira" TIMESTAMP(3);
