import Sidebar from "../components/Sidebar"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function ResenasPage() {
  const resenas = await prisma.resena.findMany({
    orderBy: { fecha: "desc" },
    include: { cliente: { select: { nombre: true, email: true } } },
  })

  const aprobacionesPendientes = await prisma.cliente.count({
    where: { rol: "ESPECIAL", estado: "PENDIENTE" }
  })

  async function eliminarResena(formData: FormData) {
    "use server"
    const id = Number(formData.get("id"))
    await prisma.resena.delete({ where: { id } })
    revalidatePath("/admin/resenas")
  }

  const promedio = resenas.length > 0
    ? (resenas.reduce((a, r) => a + r.calificacion, 0) / resenas.length).toFixed(1)
    : "0"

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar aprobacionesPendientes={aprobacionesPendientes}/>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-verde mb-1">Reseñas</h1>
        <p className="text-sm text-gray-400 mb-6">Gestión de reseñas de clientes</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-semibold text-verde">{resenas.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total reseñas</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-semibold text-verde">{promedio} ★</p>
            <p className="text-xs text-gray-400 mt-1">Promedio general</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-semibold text-verde">
              {resenas.filter(r => r.calificacion >= 4).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Reseñas positivas (4-5★)</p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-verde">Lista de reseñas</h2>
          </div>
          <table className="w-full text-xs">
            <thead className="border-b border-gray-100">
              <tr className="text-gray-400">
                <th className="text-left p-4">Cliente</th>
                <th className="text-left p-4">Producto ID</th>
                <th className="text-left p-4">Calificación</th>
                <th className="text-left p-4">Comentario</th>
                <th className="text-left p-4">Fecha</th>
                <th className="text-left p-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {resenas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Sin reseñas aún
                  </td>
                </tr>
              ) : resenas.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="text-verde font-medium">{r.cliente.nombre}</p>
                    <p className="text-gray-400">{r.cliente.email}</p>
                  </td>
                  <td className="p-4 text-gray-500">#{r.alegraProductoId}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.calificacion >= 4 ? "bg-green-100 text-green-700" :
                      r.calificacion === 3 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-500"
                    }`}>
                      {"★".repeat(r.calificacion)}{"☆".repeat(5 - r.calificacion)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 max-w-xs">
                    <p className="truncate">{r.comentario || "Sin comentario"}</p>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(r.fecha).toLocaleDateString("es-CO")}
                  </td>
                  <td className="p-4">
                    <form action={eliminarResena}>
                      <input type="hidden" name="id" value={r.id}/>
                      <button type="submit"
                        className="text-red-400 hover:text-red-600 transition-colors cursor-pointer text-xs">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}