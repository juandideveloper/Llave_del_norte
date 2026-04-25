import { NextResponse } from "next/server"
import { crearOrdenMelonn } from "@/lib/melonn"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const body = await req.json()
    const { orderId, items, cliente, direccion } = body

    const totalItems = items.reduce((acc: number, item: { cantidad: number }) => acc + item.cantidad, 0)

    const orden = await crearOrdenMelonn({
      orderId,
      totalItems,
      cliente,
      direccion,
    })

    return NextResponse.json({ ok: true, orden })
  } catch (error) {
    console.error("Error Melonn:", error)
    return NextResponse.json({ error: "Error al crear orden en Melonn" }, { status: 500 })
  }
}