import Sidebar from "../components/Sidebar"
import { prisma } from "@/lib/prisma"

export default async function SuscriptoresPage() {
  const suscriptores = await prisma.suscriptor.findMany({
    orderBy: { id: "desc" }
  })

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar/>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-verde mb-1">Suscriptores</h1>
        <p className="text-sm text-gray-400 mb-6">Gestión del newsletter y avisos comerciales</p>

        {/* Stats */}
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

        {/* Enviar boletín */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-verde mb-4">Enviar nuevo boletín</h2>
          <input type="text" placeholder="Asunto del correo..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo mb-3"/>
          <textarea placeholder="Escribe el mensaje para tus suscriptores..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo mb-3 resize-none"/>
          <button className="text-xs text-amarillo hover:underline cursor-pointer mb-3 block">
            Agregar archivo
          </button>
          <input type="text" placeholder=""
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
        </div>

        {/* Lista suscriptores */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-verde">Últimos suscriptores</h2>
          </div>
          <table className="w-full text-xs">
            <thead className="border-b border-gray-100">
              <tr className="text-gray-400">
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Fecha</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {suscriptores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">Sin suscriptores aún</td>
                </tr>
              ) : suscriptores.map((s) => (
                <tr key={s.id} className="border-b border-gray-50">
                  <td className="p-4 text-verde">{s.email}</td>
                  <td className="p-4 text-gray-400">—</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Activo</span>
                  </td>
                  <td className="p-4">
                    <button className="text-red-400 hover:text-red-600 transition-colors cursor-pointer text-xs">
                      Eliminar
                    </button>
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