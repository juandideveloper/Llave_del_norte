const MELONN_API_URL = process.env.MELONN_API_URL!
const MELONN_API_KEY = process.env.MELONN_API_KEY!

const headers = {
  "x-api-key": MELONN_API_KEY,
  "Content-Type": "application/json",
}

export async function crearOrdenMelonn(params: {
  orderId: string
  totalItems: number
  cliente: {
    nombre: string
    telefono: string
    email?: string
  }
  direccion: {
    direccion: string
    ciudad: string
    region: string
  }
}) {
  const body = {
    external_order_number: params.orderId,
    external_order_id: params.orderId,
    shipping_method_code: "MEL-13",
    tags: ["LLAVE-DEL-NORTE"],
    line_items: [{ 
      sku: "LLN-PRODUCTO", 
      quantity: params.totalItems 
    }],
    shipping_info: {
      address_l1: params.direccion.direccion,
      city: params.direccion.ciudad,
      region: params.direccion.region,
      country: "Colombia",
      full_name: params.cliente.nombre,
      phone_number: `+57-${params.cliente.telefono}`,
    },
    buyer: {
      full_name: params.cliente.nombre,
      phone_number: params.cliente.telefono,
      email: params.cliente.email || "",
    },
  }

  const res = await fetch(`${MELONN_API_URL}/sell-orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Melonn error: ${JSON.stringify(error)}`)
  }

  return await res.json()
}

export async function rastrearOrdenMelonn(externalOrderNumber: string) {
  const res = await fetch(
    `${MELONN_API_URL}/sell-orders/${externalOrderNumber}?fields=sell_order_promises`,
    { headers }
  )
  if (!res.ok) throw new Error("Error al rastrear orden")
  return await res.json()
}