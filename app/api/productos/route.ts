import { NextResponse } from "next/server"
import { getProductosAlegra } from "@/lib/alegra"

let cache: { data: unknown; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

export async function GET() {
  try {
    const ahora = Date.now()
    if (cache && ahora - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ ok: true, productos: cache.data })
    }
    const productos = await getProductosAlegra()

    // Solo mostrar productos publicados
    const filtrados = productos.filter(p => {
      const pub = p.publicado as string
      return !pub || pub === "Si"
    })

    cache = { data: filtrados, timestamp: ahora }
    return NextResponse.json({ ok: true, productos: filtrados })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}