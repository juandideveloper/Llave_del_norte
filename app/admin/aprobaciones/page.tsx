import Sidebar from "../components/Sidebar"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function AprobacionesPage() {
  const pendientes = await prisma.cliente.findMany({
    where: { rol: "ESPECIAL", estado: "PENDIENTE" },
    orderBy: { id: "desc" }
  })

  async function aprobarCliente(formData: FormData) {
    "use server"
    const id = Number(formData.get("id"))
    await prisma.cliente.update({ where: { id }, data: { estado: "APROBADO" } })
    revalidatePath("/admin/aprobaciones")
  }

  async function rechazarCliente(formData: FormData) {
    "use server"
    const id = Number(formData.get("id"))
    await prisma.cliente.update({ where: { id }, data: { estado: "RECHAZADO" } })
    revalidatePath("/admin/aprobaciones")
  }

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar/>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-verde mb-1">Aprobaciones de clientes especiales</h1>
        <p className="text-sm text-gray-400 mb-8">
          {pendientes.length} solicitudes pendientes de revisión
        </p>

        <div className="space-y-4">
          {pendientes.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">No hay solicitudes pendientes</p>
            </div>
          ) : pendientes.map((cliente) => (
            <div key={cliente.id} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-base font-semibold text-verde">{cliente.nombre}</h2>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pendiente</span>
                  </div>
                  <p className="text-xs text-gray-400">{cliente.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Empresa</p>
                  <p className="text-sm font-medium text-verde">{cliente.empresa || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">NIT</p>
                  <p className="text-sm font-medium text-verde">{cliente.nit || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Teléfono</p>
                  <p className="text-sm font-medium text-verde">{cliente.telefono || "—"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <form action={aprobarCliente}>
                  <input type="hidden" name="id" value={cliente.id}/>
                  <button type="submit"
                    className="px-5 py-2 border border-verde text-verde text-sm font-medium rounded-lg hover:bg-verde hover:text-amarillo transition-colors cursor-pointer">
                    Aprobar
                  </button>
                </form>
                <form action={rechazarCliente}>
                  <input type="hidden" name="id" value={cliente.id}/>
                  <button type="submit"
                    className="px-5 py-2 border border-red-400 text-red-500 text-sm font-medium rounded-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer">
                    Rechazar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}