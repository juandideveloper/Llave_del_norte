"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/ui/Navbar"
import Link from "next/link"

const estadosImportacion = ["CONFIRMADO", "PRODUCCION", "TRANSITO", "ADUANA", "BODEGA", "ENTREGADO"]

interface Importacion {
  id: number
  nombre: string
  proveedor: string
  paisOrigen: string | null
  estado: string
  fechaEstimada: string | null
  notas: string | null
  pedidos: {
    id: number
    total: number
    estadoPago: string
  }[]
}

function BarraProgreso({ estadoActual }: { estadoActual: string }) {
  const indiceActual = estadosImportacion.indexOf(estadoActual)
  return (
    <div className="mt-3">
      <div className="flex items-center gap-1 mb-2">
        {estadosImportacion.map((estado, i) => (
          <div key={estado} className="flex-1">
            <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
              i <= indiceActual ? "bg-amarillo" : "bg-gray-200"
            }`}/>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        {estadosImportacion.map((e) => (
          <span key={e} className={`${estadoActual === e ? "text-verde font-medium" : ""}`}>
            {e.charAt(0) + e.slice(1).toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  )
}

function colorBadge(estado: string) {
  switch (estado) {
    case "ENTREGADO": return "bg-green-100 text-green-700"
    case "TRANSITO": return "bg-blue-100 text-blue-700"
    case "CONFIRMADO": return "bg-yellow-100 text-yellow-700"
    case "PRODUCCION": return "bg-purple-100 text-purple-700"
    case "ADUANA": return "bg-orange-100 text-orange-700"
    case "BODEGA": return "bg-cyan-100 text-cyan-700"
    default: return "bg-gray-100 text-gray-500"
  }
}

export default function MisImportacionesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [importaciones, setImportaciones] = useState<Importacion[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/perfil/importaciones")
    if (status === "authenticated" && session?.user?.role !== "ESPECIAL") router.push("/")
  }, [status, session, router])

  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/perfil/importaciones")
      .then(res => res.json())
      .then(data => {
        if (data.importaciones) setImportaciones(data.importaciones)
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [status])

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-verde border-t-transparent animate-spin"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Mis importaciones" }]}/>
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-verde">Mis importaciones</h1>
            <p className="text-sm text-gray-400">Estado de tus pedidos en tránsito</p>
          </div>
          <div className="flex gap-2">
            <Link href="/perfil/pedidos"
              className="text-xs text-verde border border-verde px-3 py-1.5 rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
              Mis pedidos
            </Link>
            <Link href="/perfil/perfil"
              className="text-xs text-verde border border-verde px-3 py-1.5 rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
              Mi perfil
            </Link>
          </div>
        </div>

        {cargando ? (
          <div className="space-y-4">
            {[1,2].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48 mb-3"/>
                <div className="h-3 bg-gray-200 rounded w-32 mb-4"/>
                <div className="h-2 bg-gray-200 rounded w-full"/>
              </div>
            ))}
          </div>
        ) : importaciones.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <svg width="48" height="48" viewBox="0 0 102 102" fill="none" className="mx-auto mb-4 text-verde/20">
              <path d="M17 85V80.75H85V85H17ZM22.6398 64.0773L9.48069 42.091L15.6761 40.4728L27.0034 50.1341L44.5761 45.5483L23.6449 17.4495L31.5563 15.3818L61.7716 40.9881L79.9159 36.1824C81.5288 35.7631 83.0723 35.9876 84.5463 36.856C86.0204 37.7251 86.967 38.9661 87.3864 40.579C87.8057 42.1919 87.6354 43.7354 86.8753 45.2094C86.1153 46.6834 84.9288 47.6301 83.3159 48.0495L22.6398 64.0773Z" fill="currentColor"/>
            </svg>
            <p className="text-gray-400 text-sm mb-4">No tienes importaciones asociadas aún</p>
            <Link href="/catalogo"
              className="px-4 py-2 bg-verde text-amarillo text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {importaciones.map(imp => (
              <div key={imp.id} className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-sm font-semibold text-verde">{imp.nombre}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colorBadge(imp.estado)}`}>
                        {imp.estado.charAt(0) + imp.estado.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Proveedor: {imp.proveedor}
                      {imp.paisOrigen ? ` · Origen: ${imp.paisOrigen}` : ""}
                      {imp.fechaEstimada ? ` · Llegada estimada: ${new Date(imp.fechaEstimada).toLocaleDateString("es-CO")}` : ""}
                    </p>
                  </div>
                </div>

                <BarraProgreso estadoActual={imp.estado}/>

                {/* Pedidos del cliente en esta importación */}
                <div className="mt-4 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400 mb-2">Tus pedidos en esta importación:</p>
                  <div className="space-y-1">
                    {imp.pedidos.map(pedido => (
                      <div key={pedido.id} className="flex items-center justify-between text-xs">
                        <span className="text-verde font-medium">
                          #{String(pedido.id).padStart(5, "0")}
                        </span>
                        <span className="text-gray-400">
                          $ {pedido.total.toLocaleString("es-CO")}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          pedido.estadoPago === "PAGADO" ? "bg-green-100 text-green-700" :
                          pedido.estadoPago === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-500"
                        }`}>
                          {pedido.estadoPago}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {imp.notas && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400">📝 {imp.notas}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}