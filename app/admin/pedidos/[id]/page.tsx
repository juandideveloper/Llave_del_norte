import Sidebar from "../../components/Sidebar"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import { rastrearOrdenMelonn, crearOrdenMelonn } from "@/lib/melonn"

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

  // Rastrear orden en Melonn si existe
  let melonnData = null
  if (pedido.melonnOrderId) {
    try {
      melonnData = await rastrearOrdenMelonn(pedido.melonnOrderId)
    } catch {
      melonnData = null
    }
  }

  const estadoMelonn = melonnData?.sell_order_state?.name || null
  const trackingLink = melonnData?.melonn_tracking_link || null
  const estadoMelonnId = melonnData?.sell_order_state?.id || null

  function colorEstadoMelonn(id: number) {
    if ([7, 8].includes(id)) return "bg-green-100 text-green-700"
    if ([15, 20].includes(id)) return "bg-red-100 text-red-500"
    if ([11, 13, 21].includes(id)) return "bg-red-100 text-red-500"
    return "bg-blue-100 text-blue-700"
  }

  async function marcarPagado() {
    "use server"
    await prisma.pedido.update({
      where: { id: Number(id) },
      data: { estadoPago: "PAGADO" }
    })
    revalidatePath(`/admin/pedidos/${id}`)
  }

  async function marcarFallido() {
    "use server"
    await prisma.pedido.update({
      where: { id: Number(id) },
      data: { estadoPago: "FALLIDO" }
    })
    revalidatePath(`/admin/pedidos/${id}`)
  }

  async function crearOrdenMelonnManual() {
    "use server"
    try {
      const pedidoActual = await prisma.pedido.findUnique({
        where: { id: Number(id) },
        include: { cliente: true }
      })
      if (!pedidoActual) return

      const melonnOrderId = `LLN-MANUAL-${pedidoActual.id}-${Date.now()}`

      await crearOrdenMelonn({
        orderId: melonnOrderId,
        totalItems: 1,
        cliente: {
          nombre: pedidoActual.cliente.nombre,
          telefono: pedidoActual.cliente.telefono || "3000000000",
          email: pedidoActual.cliente.email,
        },
        direccion: {
          direccion: pedidoActual.direccionEntrega || "CALLE 65 #14-20",
          ciudad: pedidoActual.ciudadEntrega || "Bogotá",
          region: pedidoActual.ciudadEntrega || "Bogotá",
        }
      })

      await prisma.pedido.update({
        where: { id: Number(id) },
        data: { melonnOrderId }
      })
    } catch (error) {
      console.error("Error creando orden Melonn manual:", error)
    }
    revalidatePath(`/admin/pedidos/${id}`)
  }

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar aprobacionesPendientes={aprobacionesPendientes}/>
      <main className="flex-1 p-8">

        {/* Header */}
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
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Nombre</span>
                <span className="text-verde font-medium">{pedido.cliente.nombre}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Email</span>
                <span className="text-verde">{pedido.cliente.email}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Teléfono</span>
                <span className="text-verde">{pedido.cliente.telefono || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Rol</span>
                <span className="text-verde">{pedido.cliente.rol}</span>
              </div>
            </div>
          </div>

          {/* Info del pedido */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-verde mb-4">Detalles del pedido</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total</span>
                <span className="text-verde font-semibold">$ {pedido.total.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Método de pago</span>
                <span className="text-verde">{pedido.metodoPago || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Dirección entrega</span>
                <span className="text-verde text-right max-w-48">{pedido.direccionEntrega || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Ciudad</span>
                <span className="text-verde">{pedido.ciudadEntrega || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Fecha</span>
                <span className="text-verde">
                  {pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleDateString("es-CO") : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Estado Melonn */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-verde">Envío Melonn</h2>
              {pedido.melonnOrderId && (
                <span className="text-xs text-gray-400">ID: {pedido.melonnOrderId}</span>
              )}
            </div>

            {!pedido.melonnOrderId ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">No hay orden de envío creada</p>
                  <p className="text-xs text-gray-300">Puedes crearla manualmente desde aquí</p>
                </div>
                <form action={crearOrdenMelonnManual}>
                  <button type="submit"
                    className="px-4 py-2 bg-verde text-amarillo text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer">
                    Crear orden Melonn
                  </button>
                </form>
              </div>
            ) : !melonnData ? (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                No se pudo obtener el estado de Melonn
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${colorEstadoMelonn(estadoMelonnId || 0)}`}>
                    {estadoMelonn || "Sin estado"}
                  </span>
                  {trackingLink && (
                    <a href={trackingLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-verde hover:text-amarillo transition-colors underline">
                      Ver tracking
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                    </a>
                  )}
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[
                    { label: "Recibido", ids: [1, 2, 9, 10, 12] },
                    { label: "Preparando", ids: [3, 4, 5, 22, 25, 28] },
                    { label: "En tránsito", ids: [6, 7, 24] },
                    { label: "Entregado", ids: [8] },
                  ].map((etapa, i) => {
                    const activo = etapa.ids.includes(estadoMelonnId || 0)
                    const pasado = i < [
                      [1,2,9,10,12], [3,4,5,22,25,28], [6,7,24], [8]
                    ].findIndex(ids => ids.includes(estadoMelonnId || 0))
                    return (
                      <div key={etapa.label} className="flex flex-col items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          activo ? "bg-verde text-amarillo" :
                          pasado ? "bg-green-500 text-white" :
                          "bg-gray-100 text-gray-300"
                        }`}>
                          {pasado ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs text-center ${activo ? "text-verde font-medium" : "text-gray-400"}`}>
                          {etapa.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Acciones de pago */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-2">
            <h2 className="text-sm font-semibold text-verde mb-4">Acciones de pago</h2>
            <div className="flex flex-wrap gap-3">
              <form action={marcarPagado}>
                <button type="submit"
                  className="px-4 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer">
                  Marcar como pagado
                </button>
              </form>
              <form action={marcarFallido}>
                <button type="submit"
                  className="px-4 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer">
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