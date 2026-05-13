import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productoId = searchParams.get("productoId")
  if (!productoId) return NextResponse.json({ error: "Falta productoId" }, { status: 400 })

  const resenas = await prisma.resena.findMany({
    where: { alegraProductoId: productoId },
    include: { cliente: { select: { nombre: true } } },
    orderBy: { fecha: "desc" },
  })
  return NextResponse.json({ resenas })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { alegraProductoId, calificacion, comentario } = await req.json()
  if (!alegraProductoId || !calificacion) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })

  const clienteId = Number(session.user.id)

  // Verificar que ha comprado el producto
  const haCcomprado = await prisma.pedidoProducto.findFirst({
    where: {
      pedido: { clienteId, estadoPago: "PAGADO" },
      producto: { alegraProductId: alegraProductoId }
    }
  })

  if (!haCcomprado) {
    return NextResponse.json({ error: "Solo puedes reseñar productos que hayas comprado" }, { status: 403 })
  }

  // Verificar que no haya reseñado ya
  const yaReseno = await prisma.resena.findUnique({
    where: { clienteId_alegraProductoId: { clienteId, alegraProductoId } }
  })
  if (yaReseno) return NextResponse.json({ error: "Ya dejaste una reseña para este producto" }, { status: 409 })

  const resena = await prisma.resena.create({
    data: { clienteId, alegraProductoId, calificacion, comentario }
  })
  return NextResponse.json({ ok: true, resena })
}