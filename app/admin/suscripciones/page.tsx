import Sidebar from "../components/Sidebar"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import FormBoletin from "./components/FormBoletin"

export default async function SuscripcionesPage() {
  const suscriptores = await prisma.suscriptor.findMany({
    orderBy: { id: "desc" }
  })

  const aprobacionesPendientes = await prisma.cliente.count({
    where: { rol: "ESPECIAL", estado: "PENDIENTE" }
  })

  const emails = suscriptores.map(s => s.email)

  async function eliminarSuscriptor(formData: FormData) {
    "use server"
    const id = Number(formData.get("id"))
    await prisma.suscriptor.delete({ where: { id } })
    revalidatePath("/admin/suscripciones")
  }

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar aprobacionesPendientes={aprobacionesPendientes}/>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-verde mb-1">Suscriptores</h1>
        <p className="text-sm text-gray-400 mb-6">Gestión del newsletter y avisos comerciales</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-semibold text-verde">{suscriptores.length}</p>
            <p className="text-xs text-gray-400 mt-1">Suscriptores activos</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-semibold text-verde">0</p>
            <p className="text-xs text-gray-400 mt-1">Boletines enviados</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-semibold text-verde">0%</p>
            <p className="text-xs text-gray-400 mt-1">Tasa de apertura</p>
          </div>
        </div>

        <FormBoletin totalSuscriptores={suscriptores.length} emails={emails}/>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-verde">Lista de suscriptores</h2>
          </div>
          <table className="w-full text-xs">
            <thead className="border-b border-gray-100">
              <tr className="text-gray-400">
                <th className="text-left p-4">#</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {suscriptores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">Sin suscriptores aún</td>
                </tr>
              ) : suscriptores.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{i + 1}</td>
                  <td className="p-4 text-verde">{s.email}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Activo</span>
                  </td>
                  <td className="p-4">
                    <form action={eliminarSuscriptor}>
                      <input type="hidden" name="id" value={s.id}/>
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