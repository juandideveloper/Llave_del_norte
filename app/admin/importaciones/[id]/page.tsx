import Sidebar from "../../components/Sidebar"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function DetalleImportacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const aprobacionesPendientes = await prisma.cliente.count({
    where: { rol: "ESPECIAL", estado: "PENDIENTE" }
  })

  const importacion = await prisma.importacion.findUnique({
    where: { id: Number(id) },
    include: {
      pedidos: {
        include: { cliente: true }
      }
    }
  })

  if (!importacion) notFound()

  // Pedidos no asociados a esta importación
  const pedidosDisponibles = await prisma.pedido.findMany({
    where: {
      estadoPago: "PAGADO",
      importacionId: null
    },
    include: { cliente: true },
    orderBy: { id: "desc" }
  })

  async function asociarPedido(formData: FormData) {
    "use server"
    const pedidoId = Number(formData.get("pedidoId"))
    await prisma.pedido.update({
      where: { id: pedidoId },
      data: { importacionId: Number(id) }
    })
    revalidatePath(`/admin/importaciones/${id}`)
  }

  async function desasociarPedido(formData: FormData) {
    "use server"
    const pedidoId = Number(formData.get("pedidoId"))
    await prisma.pedido.update({
      where: { id: pedidoId },
      data: { importacionId: null }
    })
    revalidatePath(`/admin/importaciones/${id}`)
  }

  const estadosColor: Record<string, string> = {
    ENTREGADO: "bg-green-100 text-green-700",
    TRANSITO: "bg-blue-100 text-blue-700",
    CONFIRMADO: "bg-yellow-100 text-yellow-700",
    PRODUCCION: "bg-purple-100 text-purple-700",
    ADUANA: "bg-orange-100 text-orange-700",
    BODEGA: "bg-cyan-100 text-cyan-700",
  }

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar aprobacionesPendientes={aprobacionesPendientes}/>
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/importaciones" className="text-gray-400 hover:text-verde transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-verde">{importacion.nombre}</h1>
            <p className="text-xs text-gray-400">
              Proveedor: {importacion.proveedor}
              {importacion.paisOrigen ? ` · Origen: ${importacion.paisOrigen}` : ""}
              {importacion.numeroContenedor ? ` · Contenedor: ${importacion.numeroContenedor}` : ""}
              {importacion.fechaEstimada ? ` · Llegada: ${new Date(importacion.fechaEstimada).toLocaleDateString("es-CO")}` : ""}
            </p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${estadosColor[importacion.estado] || "bg-gray-100 text-gray-500"}`}>
            {importacion.estado.charAt(0) + importacion.estado.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pedidos asociados */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-verde">Pedidos asociados</h2>
              <span className="text-xs bg-verde text-amarillo px-2 py-0.5 rounded-full">
                {importacion.pedidos.length} pedidos
              </span>
            </div>

            {importacion.pedidos.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No hay pedidos asociados</p>
            ) : (
              <div className="space-y-2">
                {importacion.pedidos.map(pedido => (
                  <div key={pedido.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200">
                    <div>
                      <p className="text-xs font-medium text-verde">
                        #{String(pedido.id).padStart(5, "0")} · {pedido.cliente.nombre}
                      </p>
                      <p className="text-xs text-gray-400">{pedido.cliente.email}</p>
                      <p className="text-xs text-gray-400">$ {pedido.total.toLocaleString("es-CO")}</p>
                    </div>
                    <form action={desasociarPedido}>
                      <input type="hidden" name="pedidoId" value={pedido.id}/>
                      <button type="submit"
                        className="text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50">
                        Quitar
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agregar pedidos */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-verde">Agregar pedidos</h2>
              <span className="text-xs text-gray-400">{pedidosDisponibles.length} disponibles</span>
            </div>

            {pedidosDisponibles.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No hay pedidos pagados sin importación asignada</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {pedidosDisponibles.map(pedido => (
                  <div key={pedido.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-verde transition-colors">
                    <div>
                      <p className="text-xs font-medium text-verde">
                        #{String(pedido.id).padStart(5, "0")} · {pedido.cliente.nombre}
                      </p>
                      <p className="text-xs text-gray-400">{pedido.cliente.email}</p>
                      <p className="text-xs text-gray-400">$ {pedido.total.toLocaleString("es-CO")}</p>
                    </div>
                    <form action={asociarPedido}>
                      <input type="hidden" name="pedidoId" value={pedido.id}/>
                      <button type="submit"
                        className="text-xs text-verde hover:text-amarillo transition-colors cursor-pointer border border-verde px-2 py-1 rounded-lg hover:bg-verde">
                        Agregar
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notas */}
          {importacion.notas && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-2">
              <h2 className="text-sm font-semibold text-verde mb-2">Notas</h2>
              <p className="text-xs text-gray-500 leading-relaxed">{importacion.notas}</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}