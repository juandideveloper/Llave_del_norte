import { NextResponse } from "next/server"

const ALEGRA_EMAIL = process.env.ALEGRA_EMAIL!
const ALEGRA_TOKEN = process.env.ALEGRA_TOKEN!
const BASE_URL = "https://api.alegra.com/api/v1"

const headers = {
  "Authorization": `Basic ${Buffer.from(`${ALEGRA_EMAIL}:${ALEGRA_TOKEN}`).toString("base64")}`,
  "Content-Type": "application/json",
}

// NUEVO: mismo cálculo de IVA que en lib/alegra.ts
interface PriceListEntry {
  price: string | number
  idPriceList?: number
  name?: string
  [key: string]: unknown
}

function calcularPorcentajeIva(tax?: { percentage: string }[]) {
  if (!tax || tax.length === 0) return 0
  return tax.reduce((suma, t) => suma + Number(t.percentage), 0)
}

function aplicarIva(price: unknown, tax?: { percentage: string }[]) {
  const porcentajeIva = calcularPorcentajeIva(tax)
  const factor = 1 + porcentajeIva / 100

  if (Array.isArray(price)) {
    return (price as PriceListEntry[]).map((p) => {
      const base = Number(p.price)
      return {
        ...p,
        price: base,
        precioConIva: Number((base * factor).toFixed(2)),
      }
    })
  }

  const base = Number(price)
  return [{ price: base, precioConIva: Number((base * factor).toFixed(2)) }]
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await fetch(
      `${BASE_URL}/items/${id}?fields=id,name,description,reference,status,price,inventory,category,images,itemCategory,customFields,tax`,
      { headers }
    )
    if (!res.ok) throw new Error("Producto no encontrado")
    const data = await res.json()

    // Parsear customFields
    const customFields = data.customFields || []
    const getField = (name: string) => customFields.find((f: { name: string; value: string }) => f.name === name)?.value || null

    const producto = {
      ...data,
      price: aplicarIva(data.price, data.tax), // <-- NUEVO: ahora sí trae precioConIva
      precioMayorista: getField("precioMayorista") ? Number(getField("precioMayorista")) : null,
      relacionados: getField("relacionados") ? getField("relacionados").split(",").map((s: string) => s.trim()) : [],
      garantia: getField("garantia") || null,
    }

    return NextResponse.json({ ok: true, producto })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}