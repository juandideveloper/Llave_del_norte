import { NextResponse } from "next/server"
import { getProductosAlegra } from "@/lib/alegra"

export async function GET() {
  try {
    const productos = await getProductosAlegra()
    return NextResponse.json({ ok: true, productos })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}