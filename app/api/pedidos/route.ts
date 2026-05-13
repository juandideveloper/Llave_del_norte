import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EstadoPago } from "@prisma/client"

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const estadoPago = searchParams.get("estadoPago")

    const pedidos = await prisma.pedido.findMany({
      where: {
        ...(estadoPago ? { estadoPago: estadoPago as EstadoPago } : {})
      },
      orderBy: { id: "desc" },
      include: {
        cliente: {
          select: { nombre: true, email: true }
        }
      }
    })

    return NextResponse.json({ pedidos })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}