import { NextResponse } from "next/server"

const ALEGRA_EMAIL = process.env.ALEGRA_EMAIL!
const ALEGRA_TOKEN = process.env.ALEGRA_TOKEN!
const BASE_URL = "https://api.alegra.com/api/v1"

const headers = {
  "Authorization": `Basic ${Buffer.from(`${ALEGRA_EMAIL}:${ALEGRA_TOKEN}`).toString("base64")}`,
  "Content-Type": "application/json",
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await fetch(`${BASE_URL}/items/${id}?fields=id,name,description,reference,status,price,inventory,category,images,itemCategory`, { headers })
    if (!res.ok) throw new Error("Producto no encontrado")
    const data = await res.json()
    return NextResponse.json({ ok: true, producto: data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}