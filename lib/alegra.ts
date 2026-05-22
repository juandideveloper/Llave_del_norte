const ALEGRA_EMAIL = process.env.ALEGRA_EMAIL!
const ALEGRA_TOKEN = process.env.ALEGRA_TOKEN!

const BASE_URL = "https://api.alegra.com/api/v1"

const headers = {
  "Authorization": `Basic ${Buffer.from(`${ALEGRA_EMAIL}:${ALEGRA_TOKEN}`).toString("base64")}`,
  "Content-Type": "application/json",
}

function parsearCustomFields(customFields: { name: string; value: string }[]) {
  const getField = (name: string) => customFields?.find(f => f.name === name)?.value || null
  return {
    precioMayorista: getField("precioMayorista") ? Number(getField("precioMayorista")) : null,
    relacionados: getField("relacionados") ? getField("relacionados")!.split(",").map(s => s.trim()) : [],
    garantia: getField("garantia") || null,
    material: getField("Material") || null,
  }
}

export async function getProductosAlegra() {
  const res = await fetch(
    `${BASE_URL}/items?limit=100&fields=id,name,description,reference,status,price,inventory,category,itemCategory,images,customFields,tax`,
    { headers }
  )
  const data = await res.json()

  const productos = Array.isArray(data) ? data : (data.data || data.items || [])

  return productos.map((producto: {
    customFields?: { name: string; value: string }[]
    itemCategory?: { id: number; name: string }
    category?: { id: string; name: string }
    tax?: { percentage: string }[]
  } & Record<string, unknown>) => ({
    ...producto,
    category: producto.itemCategory
      ? { id: String(producto.itemCategory.id), name: producto.itemCategory.name }
      : producto.category,
    customFields: producto.customFields || [],
    ...parsearCustomFields(producto.customFields || []),
  }))
}

export async function getProductoAlegra(id: number) {
  const res = await fetch(
    `${BASE_URL}/items/${id}?fields=id,name,description,reference,status,price,inventory,category,itemCategory,images,customFields,tax`,
    { headers }
  )
  if (!res.ok) throw new Error("Error al obtener producto de Alegra")
  const data = await res.json()
  return {
    ...data,
    category: data.itemCategory
      ? { id: String(data.itemCategory.id), name: data.itemCategory.name }
      : data.category,
    customFields: data.customFields || [],
    ...parsearCustomFields(data.customFields || []),
  }
}

export async function crearFacturaAlegra(pedido: {
  clienteId: number
  clienteNombre: string
  clienteEmail: string
  items: { id: number; nombre: string; precio: number; cantidad: number }[]
  total: number
}) {
  const body = {
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    client: { id: pedido.clienteId },
    items: pedido.items.map(item => ({
      id: item.id,
      quantity: item.cantidad,
      price: item.precio,
    })),
  }

  const res = await fetch(`${BASE_URL}/invoices`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Error al crear factura: ${JSON.stringify(error)}`)
  }

  return res.json()
}