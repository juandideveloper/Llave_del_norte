import Sidebar from "../components/Sidebar"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import SelectorEstado from "./components/SelectorEstado"

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
              <SelectorEstado
                importacionId={imp.id}
                estadoActual={imp.estado}
                nombre={imp.nombre}
              />

              <p className="text-xs text-gray-400 mt-2 mb-2">
                {imp.pedidos.length} pedidos asociados · Proveedor: {imp.proveedor || "—"}
                {imp.paisOrigen ? ` · Origen: ${imp.paisOrigen}` : ""}
                {imp.fechaEstimada ? ` · Llegada: ${new Date(imp.fechaEstimada).toLocaleDateString("es-CO")}` : ""}
              </p>

              {imp.pedidos.length > 0 && (
                <p className="text-xs text-gray-700 mb-4">
                  Pedidos: {imp.pedidos.map(p => `#${String(p.id).padStart(5, "0")}`).join(" · ")}
                </p>
              )}

              <Link href={`/admin/importaciones/${imp.id}`}
                className="inline-block px-4 py-2 border border-verde text-verde text-xs font-medium rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
                Ver detalle
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}