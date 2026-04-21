import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10)
  
  await prisma.cliente.upsert({
    where: { email: "admin@llavedelnorte.com" },
    update: {},
    create: {
      nombre: "Admin Sistema",
      email: "admin@llavedelnorte.com",
      password: passwordHash,
      rol: "ADMIN",
      estado: "APROBADO",
    }
  })
  
  console.log("✅ Admin creado")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())