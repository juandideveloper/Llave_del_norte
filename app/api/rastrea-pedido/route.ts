import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { numeroPedido, email } = body

    if (!numeroPedido || !email) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    // Buscar por ID numérico o por melonnOrderId
    const idNumerico = parseInt(numeroPedido.replace(/\D/g, ""))

    const pedido = await prisma.pedido.findFirst({
      where: {
        OR: [
          { id: isNaN(idNumerico) ? -1 : idNumerico },
          { melonnOrderId: { contains: numeroPedido } }
        ],
        cliente: { email: email.toLowerCase().trim() }
      },
      select: {
        id: true,
        estadoPago: true,
        metodoPago: true,
        total: true,
        direccionEntrega: true,
        ciudadEntrega: true,
        fechaPedido: true,
        melonnOrderId: true,
      }
    })

    if (!pedido) {
      return NextResponse.json({ error: "No encontramos un pedido con esos datos" }, { status: 404 })
    }

    return NextResponse.json({ ok: true, pedido })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al buscar el pedido" }, { status: 500 })
  }
}