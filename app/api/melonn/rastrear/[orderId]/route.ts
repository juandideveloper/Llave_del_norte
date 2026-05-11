import { NextResponse } from "next/server"
import { rastrearOrdenMelonn } from "@/lib/melonn"

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params
    const orden = await rastrearOrdenMelonn(orderId)
    return NextResponse.json({ ok: true, orden })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al rastrear orden" }, { status: 500 })
  }
}