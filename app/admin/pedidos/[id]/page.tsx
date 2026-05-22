import Sidebar from "../../components/Sidebar"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function DetallePedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const aprobacionesPendientes = await prisma.cliente.count({
    where: { rol: "ESPECIAL", estado: "PENDIENTE" }
  })

  const pedido = await prisma.pedido.findUnique({
    where: { id: Number(id) },
    include: { cliente: true }
  })

  if (!pedido) notFound()

  const productosDelPedido = pedido.productosJson
    ? JSON.parse(pedido.productosJson) as { id: number; nombre: string; precio: number; cantidad: number }[]
    : []

  async function marcarPagado() {
    "use server"
    await prisma.pedido.update({ where: { id: Number(id) }, data: { estadoPago: "PAGADO" } })
    revalidatePath(`/admin/pedidos/${id}`)
  }

  async function marcarFallido() {
    "use server"
    await prisma.pedido.update({ where: { id: Number(id) }, data: { estadoPago: "FALLIDO" } })
    revalidatePath(`/admin/pedidos/${id}`)
  }

  async function actualizarGuia(formData: FormData) {
    "use server"
    const guia = formData.get("guia") as string
    await prisma.pedido.update({ where: { id: Number(id) }, data: { guiaInterrapidisimo: guia || null } })
    revalidatePath(`/admin/pedidos/${id}`)
  }

  async function actualizarEstadoEnvio(formData: FormData) {
    "use server"
    const estado = formData.get("estado") as string
    await prisma.pedido.update({ where: { id: Number(id) }, data: { melonnOrderId: estado || null } })
    revalidatePath(`/admin/pedidos/${id}`)
  }

  const estadosEnvio = [
    "Pendiente de recolección", "Recolectado", "En bodega", "En tránsito",
    "En ciudad destino", "En reparto", "Entregado", "Novedad",
  ]

  const estadoActual = pedido.melonnOrderId || null

  function colorEstado(estado: string | null) {
    if (!estado) return "bg-gray-100 text-gray-400"
    if (estado === "Entregado") return "bg-green-100 text-green-700"
    if (estado === "Novedad") return "bg-red-100 text-red-500"
    if (estado === "En reparto" || estado === "En tránsito") return "bg-blue-100 text-blue-700"
    return "bg-yellow-100 text-yellow-700"
  }

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar aprobacionesPendientes={aprobacionesPendientes}/>
      <main className="flex-1 p-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/pedidos" className="text-gray-400 hover:text-verde transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-verde">
            Pedido #{String(pedido.id).padStart(5, "0")}
          </h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            pedido.estadoPago === "PAGADO" ? "bg-green-100 text-green-700" :
            pedido.estadoPago === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-500"
          }`}>
            {pedido.estadoPago}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Info del cliente */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-verde mb-4">Cliente</h2>
            <div className="space-y-2">
              {[
                { label: "Nombre", valor: pedido.cliente.nombre },
                { label: "Email", valor: pedido.cliente.email },
                { label: "Teléfono", valor: pedido.cliente.telefono || "—" },
                { label: "Rol", valor: pedido.cliente.rol },
              ].map(({ label, valor }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-verde font-medium">{valor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info del pedido */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-verde mb-4">Detalles del pedido</h2>
            <div className="space-y-2">
              {[
                { label: "Total", valor: `$ ${pedido.total.toLocaleString("es-CO")}` },
                { label: "Método de pago", valor: pedido.metodoPago || "—" },
                { label: "Dirección entrega", valor: pedido.direccionEntrega || "—" },
                { label: "Ciudad", valor: pedido.ciudadEntrega || "—" },
                { label: "Fecha", valor: pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleDateString("es-CO") : "—" },
              ].map(({ label, valor }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-verde text-right max-w-48">{valor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Productos del pedido */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-2">
            <h2 className="text-sm font-semibold text-verde mb-4">Productos del pedido</h2>
            {productosDelPedido.length === 0 ? (
              <p className="text-xs text-gray-400">Sin detalle de productos</p>
            ) : (
              <table className="w-full text-xs">
                <thead className="border-b border-gray-100">
                  <tr className="text-gray-400">
                    <th className="text-left p-2">Producto</th>
                    <th className="text-left p-2">Cantidad</th>
                    <th className="text-left p-2">Precio unit.</th>
                    <th className="text-left p-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {productosDelPedido.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="p-2 text-verde font-medium">{item.nombre}</td>
                      <td className="p-2 text-gray-500">{item.cantidad}</td>
                      <td className="p-2 text-gray-500">$ {item.precio.toLocaleString("es-CO")}</td>
                      <td className="p-2 text-verde font-medium">$ {(item.precio * item.cantidad).toLocaleString("es-CO")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Gestión de envío */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-2">
            <h2 className="text-sm font-semibold text-verde mb-4">Gestión de envío — Interrapidísimo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-2">Número de guía</p>
                <form action={actualizarGuia} className="flex gap-2">
                  <input name="guia" type="text" defaultValue={pedido.guiaInterrapidisimo || ""}
                    placeholder="Ej: 1234567890"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs text-verde outline-none focus:border-amarillo"/>
                  <button type="submit" className="px-3 py-2 bg-verde text-amarillo text-xs rounded-lg hover:opacity-90 cursor-pointer">
                    Guardar
                  </button>
                </form>
                {pedido.guiaInterrapidisimo && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Guía:</span>
                    <span className="text-xs font-medium text-verde">{pedido.guiaInterrapidisimo}</span>
                    <a href={`https://www.interrapidisimo.com/rastrea-tu-envio/?guia=${pedido.guiaInterrapidisimo}`}
                      target="_blank" rel="noopener noreferrer" className="text-xs text-amarillo hover:underline">
                      Rastrear →
                    </a>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Estado del envío</p>
                <form action={actualizarEstadoEnvio} className="flex gap-2">
                  <select name="estado" defaultValue={estadoActual || ""}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs text-verde outline-none focus:border-amarillo bg-white">
                    <option value="">Sin estado</option>
                    {estadosEnvio.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <button type="submit" className="px-3 py-2 bg-verde text-amarillo text-xs rounded-lg hover:opacity-90 cursor-pointer">
                    Guardar
                  </button>
                </form>
                {estadoActual && (
                  <div className="mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${colorEstado(estadoActual)}`}>{estadoActual}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-4 md:grid-cols-8 gap-2">
              {estadosEnvio.map((e, i) => {
                const indexActual = estadosEnvio.indexOf(estadoActual || "")
                const activo = e === estadoActual
                const pasado = indexActual > i
                return (
                  <div key={e} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      activo ? "bg-verde text-amarillo" : pasado ? "bg-green-500 text-white" : "bg-gray-100 text-gray-300"
                    }`}>
                      {pasado ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs text-center leading-tight ${activo ? "text-verde font-medium" : "text-gray-400"}`}>
                      {e}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Acciones de pago */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-2">
            <h2 className="text-sm font-semibold text-verde mb-4">Acciones de pago</h2>
            <div className="flex flex-wrap gap-3">
              <form action={marcarPagado}>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer">
                  Marcar como pagado
                </button>
              </form>
              <form action={marcarFallido}>
                <button type="submit" className="px-4 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer">
                  Marcar como fallido
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}