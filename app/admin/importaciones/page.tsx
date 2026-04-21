import Sidebar from "../components/Sidebar"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

const estadosImportacion = [
  "CONFIRMADO",
  "PRODUCCION",
  "TRANSITO",
  "ADUANA",
  "BODEGA",
  "ENTREGADO"
]

function BarraProgreso({ estadoActual }: { estadoActual: string }) {
  const indiceActual = estadosImportacion.indexOf(estadoActual)

  return (
    <div className="flex items-center gap-1 mt-3 mb-2">
      {estadosImportacion.map((estado, i) => (
        <div key={estado} className="flex items-center gap-1 flex-1">
          <div className={`h-1.5 w-full rounded-full ${
            i <= indiceActual ? "bg-amarillo" : "bg-gray-200"
          }`}/>
        </div>
      ))}
    </div>
  )
}

export default async function ImportacionesPage() {
  const importaciones = await prisma.importacion.findMany({
    orderBy: { id: "desc" },
    include: { pedidos: true }
  })

  return (
    <div className="flex min-h-screen bg-hueso">
      <Sidebar/>
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-verde mb-1">Importaciones</h1>
            <p className="text-sm text-gray-400">Gestión de importaciones y estados de envío</p>
          </div>
          <Link href="/admin/importaciones/nueva"
            className="px-4 py-2 border border-verde text-verde text-sm font-medium rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
            + Nueva Importación
          </Link>
        </div>

        <div className="space-y-4">
          {importaciones.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">No hay importaciones registradas</p>
            </div>
          ) : importaciones.map((imp) => (
            <div key={imp.id} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-verde">{imp.nombre}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      imp.estado === "ENTREGADO" ? "bg-green-100 text-green-700" :
                      imp.estado === "TRANSITO" ? "bg-blue-100 text-blue-700" :
                      imp.estado === "CONFIRMADO" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {imp.estado}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {imp.pedidos.length} pedidos asociados · Proveedor: {imp.proveedor || "—"}
                  </p>
                </div>

                {/* Selector de estado */}
                <form>
                  <select
                    defaultValue={imp.estado}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-verde outline-none cursor-pointer appearance-none pr-8 relative"
                  >
                    {estadosImportacion.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </form>
              </div>

              {/* Barra de progreso */}
              <BarraProgreso estadoActual={imp.estado}/>

              {/* Etiquetas de estados */}
              <div className="flex justify-between text-xs text-gray-400 mb-4">
                {estadosImportacion.map((e) => (
                  <span key={e} className={`${imp.estado === e ? "text-amarillo font-medium" : ""}`}>
                    {e.charAt(0) + e.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>

              {/* Pedidos asociados */}
              {imp.pedidos.length > 0 && (
                <p className="text-xs text-gray-400 mb-3">
                  Pedidos: {imp.pedidos.map(p => `#${String(p.id).padStart(5, "0")}`).join(" · ")}
                </p>
              )}

              <Link href={`/admin/importaciones/${imp.id}`}
                className="inline-block px-4 py-2 border border-verde text-verde text-xs font-medium rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
                Ver pedidos
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}