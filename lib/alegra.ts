// const ALEGRA_EMAIL = process.env.ALEGRA_EMAIL!
// const ALEGRA_TOKEN = process.env.ALEGRA_TOKEN!

// const BASE_URL = "https://api.alegra.com/api/v1"

// const headers = {
//   "Authorization": `Basic ${Buffer.from(`${ALEGRA_EMAIL}:${ALEGRA_TOKEN}`).toString("base64")}`,
//   "Content-Type": "application/json",
// }

// function parsearCustomFields(customFields: { name: string; value: string }[]) {
//   const getField = (name: string) => customFields?.find(f => f.name === name)?.value || null
//   return {
//     precioMayorista: getField("precioMayorista") ? Number(getField("precioMayorista")) : null,
//     relacionados: getField("relacionados") ? getField("relacionados")!.split(",").map(s => s.trim()) : [],
//     garantia: getField("garantia") || null,
//     material: getField("Material") || null,
//     publicado: getField("Publicado") ?? "Si",
//   }
// }

// type ProductoAlegraRaw = {
//   customFields?: { name: string; value: string }[]
//   itemCategory?: { id: number; name: string }
//   category?: { id: string; name: string }
//   tax?: { percentage: string }[]
// } & Record<string, unknown>

// export async function getProductosAlegra() {
//   let todos: ProductoAlegraRaw[] = []
//   let start = 0
//   const limit = 30

//   while (true) {
//     const res = await fetch(
//       `${BASE_URL}/items?limit=${limit}&start=${start}&fields=id,name,description,reference,status,price,inventory,category,itemCategory,images,customFields,tax`,
//       { headers }
//     )
//     const data = await res.json()
//     const pagina: ProductoAlegraRaw[] = Array.isArray(data) ? data : (data.data || data.items || [])

//     if (pagina.length === 0) break

//     todos = [...todos, ...pagina]

//     if (pagina.length < limit) break
//     start += limit
//   }

//   return todos.map((producto) => ({
//     ...producto,
//     category: producto.itemCategory
//       ? { id: String(producto.itemCategory.id), name: producto.itemCategory.name }
//       : producto.category,
//     customFields: producto.customFields || [],
//     ...parsearCustomFields(producto.customFields || []),
//   }))
// }

// export async function getProductoAlegra(id: number) {
//   const res = await fetch(
//     `${BASE_URL}/items/${id}?fields=id,name,description,reference,status,price,inventory,category,itemCategory,images,customFields,tax`,
//     { headers }
//   )
//   if (!res.ok) throw new Error("Error al obtener producto de Alegra")
//   const data = await res.json()
//   return {
//     ...data,
//     category: data.itemCategory
//       ? { id: String(data.itemCategory.id), name: data.itemCategory.name }
//       : data.category,
//     customFields: data.customFields || [],
//     ...parsearCustomFields(data.customFields || []),
//   }
// }

// export async function crearFacturaAlegra(pedido: {
//   clienteId: number
//   clienteNombre: string
//   clienteEmail: string
//   items: { id: number; nombre: string; precio: number; cantidad: number }[]
//   total: number
// }) {
//   const body = {
//     date: new Date().toISOString().split("T")[0],
//     dueDate: new Date().toISOString().split("T")[0],
//     client: { id: pedido.clienteId },
//     items: pedido.items.map(item => ({
//       id: item.id,
//       quantity: item.cantidad,
//       price: item.precio,
//     })),
//   }

//   const res = await fetch(`${BASE_URL}/invoices`, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(body),
//   })

//   if (!res.ok) {
//     const error = await res.json()
//     throw new Error(`Error al crear factura: ${JSON.stringify(error)}`)
//   }

//   return res.json()
// }
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
    publicado: getField("Publicado") ?? "Si",
  }
}

// NUEVO: tipo explícito para cada entrada del array "price" que devuelve Alegra
interface PriceListEntry {
  price: string | number
  idPriceList?: number
  name?: string
  [key: string]: unknown
}

// NUEVO: calcula el % total de IVA a partir del array "tax" de Alegra
function calcularPorcentajeIva(tax?: { percentage: string }[]) {
  if (!tax || tax.length === 0) return 0
  return tax.reduce((suma, t) => suma + Number(t.percentage), 0)
}

// NUEVO: toma el precio base (o array de precios) y devuelve el precio con IVA
function aplicarIva(price: unknown, tax?: { percentage: string }[]) {
  const porcentajeIva = calcularPorcentajeIva(tax)
  const factor = 1 + porcentajeIva / 100

  // En Alegra, "price" normalmente viene como array: [{ price: "100000", idPriceList: 1, ... }, ...]
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

  // Por si en algún momento viene como número plano
  const base = Number(price)
  return [{ price: base, precioConIva: Number((base * factor).toFixed(2)) }]
}

type ProductoAlegraRaw = {
  customFields?: { name: string; value: string }[]
  itemCategory?: { id: number; name: string }
  category?: { id: string; name: string }
  tax?: { percentage: string }[]
  price?: unknown
} & Record<string, unknown>

export async function getProductosAlegra() {
  let todos: ProductoAlegraRaw[] = []
  let start = 0
  const limit = 30

  while (true) {
    const res = await fetch(
      `${BASE_URL}/items?limit=${limit}&start=${start}&fields=id,name,description,reference,status,price,inventory,category,itemCategory,images,customFields,tax`,
      { headers }
    )
    const data = await res.json()
    const pagina: ProductoAlegraRaw[] = Array.isArray(data) ? data : (data.data || data.items || [])

    if (pagina.length === 0) break

    todos = [...todos, ...pagina]

    if (pagina.length < limit) break
    start += limit
  }

  return todos.map((producto) => ({
    ...producto,
    category: producto.itemCategory
      ? { id: String(producto.itemCategory.id), name: producto.itemCategory.name }
      : producto.category,
    customFields: producto.customFields || [],
    price: aplicarIva(producto.price, producto.tax),
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
    price: aplicarIva(data.price, data.tax),
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