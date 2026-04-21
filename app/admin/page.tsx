import Sidebar from "./components/Sidebar"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const [
    aprobacionesPendientes,
    importacionesActivas,
    ultimosPedidos,
    clientesPendientes,
  ] = await Promise.all([
    prisma.cliente.count({ where: { rol: "ESPECIAL", estado: "PENDIENTE" } }),
    prisma.importacion.count({ where: { estado: { not: "ENTREGADO" } } }),
    prisma.pedido.findMany({
      take: 4,
      orderBy: { id: "desc" },
      include: { cliente: true }
    }),
    prisma.cliente.findMany({
      where: { rol: "ESPECIAL", estado: "PENDIENTE" },
      take: 3
    }),
  ])

  const pedidosNuevos = ultimosPedidos.length

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar/>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-verde mb-1">Dashboard</h1>
        <p className="text-sm text-gray-400 mb-8">
          Resumen del día — {new Date().toLocaleDateString("es-CO", {
            day: "numeric", month: "long", year: "numeric"
          })}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Ventas hoy</p>
            <p className="text-2xl font-semibold text-verde">$0</p>
            <p className="text-xs text-green-500 mt-1">+0% vs ayer</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Pedidos nuevos</p>
            <p className="text-2xl font-semibold text-verde">{pedidosNuevos}</p>
            <p className="text-xs text-gray-400 mt-1">Últimos registrados</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Aprobaciones pendientes</p>
            <p className={`text-2xl font-semibold ${aprobacionesPendientes > 0 ? "text-red-500" : "text-verde"}`}>
              {aprobacionesPendientes}
            </p>
            {aprobacionesPendientes > 0 ? (
              <Link href="/admin/aprobaciones" className="text-xs text-red-400 mt-1 block hover:underline">
                Requieren atención
              </Link>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Sin pendientes</p>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Importaciones activas</p>
            <p className="text-2xl font-semibold text-verde">{importacionesActivas}</p>
            <p className="text-xs text-gray-400 mt-1">En tránsito</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Últimos pedidos */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-verde">Últimos pedidos</h2>
              <Link href="/admin/pedidos" className="text-xs text-amarillo hover:underline">
                Ver todos
              </Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2">Pedido</th>
                  <th className="text-left pb-2">Cliente</th>
                  <th className="text-left pb-2">Total</th>
                  <th className="text-left pb-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimosPedidos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-gray-400 py-4 text-center">Sin pedidos aún</td>
                  </tr>
                ) : ultimosPedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b border-gray-50">
                    <td className="py-2 text-gray-500">#{String(pedido.id).padStart(5, "0")}</td>
                    <td className="py-2 text-verde">{pedido.cliente.nombre}</td>
                    <td className="py-2 text-verde">${pedido.total.toLocaleString("es-CO")}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        pedido.estadoPago === "PAGADO" ? "bg-green-100 text-green-700" :
                        pedido.estadoPago === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-500"
                      }`}>
                        {pedido.estadoPago}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clientes especiales pendientes */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-verde">Clientes especiales pendientes</h2>
              <Link href="/admin/aprobaciones" className="text-xs text-amarillo hover:underline">
                Ver todos
              </Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2">Nombre</th>
                  <th className="text-left pb-2">Empresa</th>
                  <th className="text-left pb-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientesPendientes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-gray-400 py-4 text-center">Sin pendientes</td>
                  </tr>
                ) : clientesPendientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-gray-50">
                    <td className="py-2 text-verde">{cliente.nombre}</td>
                    <td className="py-2 text-gray-500">{cliente.empresa || "—"}</td>
                    <td className="py-2">
                      <Link href="/admin/aprobaciones"
                        className="px-2 py-1 border border-verde text-verde rounded-md hover:bg-verde hover:text-amarillo transition-colors text-xs">
                        Revisar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}