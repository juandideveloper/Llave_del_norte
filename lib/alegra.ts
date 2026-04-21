const ALEGRA_EMAIL = process.env.ALEGRA_EMAIL!
const ALEGRA_TOKEN = process.env.ALEGRA_TOKEN!

const BASE_URL = "https://api.alegra.com/api/v1"

const headers = {
  "Authorization": `Basic ${Buffer.from(`${ALEGRA_EMAIL}:${ALEGRA_TOKEN}`).toString("base64")}`,
  "Content-Type": "application/json",
}

// Obtener todos los productos
export async function getProductosAlegra() {
  const res = await fetch(`${BASE_URL}/items?limit=30`, { headers })
  const data = await res.json()
  console.log("Alegra response:", res.status, JSON.stringify(data))
  if (!res.ok) throw new Error(`Error Alegra: ${JSON.stringify(data)}`)
  return data
}

// Obtener un producto por ID
export async function getProductoAlegra(id: number) {
  const res = await fetch(`${BASE_URL}/items/${id}`, { headers })
  if (!res.ok) throw new Error("Error al obtener producto de Alegra")
  return res.json()
}

// Crear factura en Alegra
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
    client: {
      id: pedido.clienteId,
    },
    items: pedido.items.map((item) => ({
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