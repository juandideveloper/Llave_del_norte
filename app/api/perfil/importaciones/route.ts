import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const importaciones = await prisma.importacion.findMany({
      where: {
        pedidos: {
          some: {
            clienteId: Number(session.user.id)
          }
        }
      },
      include: {
        pedidos: {
          where: { clienteId: Number(session.user.id) },
          select: {
            id: true,
            total: true,
            estadoPago: true,
          }
        }
      },
      orderBy: { id: "desc" }
    })

    return NextResponse.json({ importaciones })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al obtener importaciones" }, { status: 500 })
  }
}