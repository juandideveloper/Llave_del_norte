import Sidebar from "../components/Sidebar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { id: "desc" },
    include: { cliente: true },
  });

  const todos = pedidos.length;
  const confirmados = pedidos.filter((p) => p.estadoPago === "PAGADO").length;
  const cancelados = pedidos.filter((p) => p.estadoPago === "FALLIDO").length;

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-verde mb-1">Pedidos</h1>
        <p className="text-sm text-gray-400 mb-6">
          Gestión de todos los pedidos
        </p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            `TODOS (${todos})`,
            `Confirmados (${confirmados})`,
            `Fallidos (${cancelados})`,
          ].map((f) => (
            <button
              key={f}
              className="px-4 py-1.5 border border-verde text-verde text-xs rounded-lg hover:bg-verde hover:text-amarillo transition-colors cursor-pointer"
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="border-b border-gray-100">
              <tr className="text-gray-400">
                <th className="text-left p-4">Pedido</th>
                <th className="text-left p-4">Cliente</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Método pago</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Dirección</th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Sin pedidos aún
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-500">
                      #{String(pedido.id).padStart(5, "0")}
                    </td>
                    <td className="p-4">
                      <p className="text-verde font-medium">
                        {pedido.cliente.nombre}
                      </p>
                      <p className="text-gray-400">{pedido.cliente.email}</p>
                    </td>
                    <td className="p-4 text-verde font-medium">
                      ${pedido.total.toLocaleString("es-CO")}
                    </td>
                    <td className="p-4 text-gray-500">
                      {pedido.metodoPago || "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          pedido.estadoPago === "PAGADO"
                            ? "bg-green-100 text-green-700"
                            : pedido.estadoPago === "PENDIENTE"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-500"
                        }`}
                      >
                        {pedido.estadoPago}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">
                      {pedido.direccionEntrega || "—"}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/pedidos/${pedido.id}`}
                        className="px-3 py-1.5 border border-verde text-verde rounded-lg hover:bg-verde hover:text-amarillo transition-colors text-xs"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
