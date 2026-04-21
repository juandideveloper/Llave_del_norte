import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await req.json()
    const { items, total, direccionEntrega, ciudadEntrega, metodoPago } = body

    const pedido = await prisma.pedido.create({
      data: {
        clienteId: Number(session.user.id),
        total,
        direccionEntrega,
        ciudadEntrega,
        metodoPago,
        estadoPago: "PENDIENTE",
      }
    })

    return NextResponse.json({ ok: true, pedidoId: pedido.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}