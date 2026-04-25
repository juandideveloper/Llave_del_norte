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

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar aprobacionesPendientes={aprobacionesPendientes}/>
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/pedidos"
            className="text-gray-400 hover:text-verde transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5">
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
                <span className="text-gray-400">Guía Interrapidísimo</span>
                <span className="text-verde">{pedido.guiaInterrapidisimo || "Sin asignar"}</span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 md:col-span-2">
            <h2 className="text-sm font-semibold text-verde mb-4">Acciones</h2>
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