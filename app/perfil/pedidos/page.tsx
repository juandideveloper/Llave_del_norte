"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/ui/Navbar"
import Link from "next/link"

interface ItemPedido {
  id: number
  nombre: string
  precio: number
  cantidad: number
}

interface Pedido {
  id: number
  total: number
  estadoPago: string
  metodoPago: string | null
  direccionEntrega: string | null
  ciudadEntrega: string | null
  fechaPedido: string | null
  melonnOrderId: string | null
  guiaInterrapidisimo: string | null
  productosJson: string | null
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${
      estado === "PAGADO" ? "bg-green-100 text-green-700" :
      estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
      "bg-red-100 text-red-500"
    }`}>
      {estado}
    </span>
  )
}

function EnvioBadge({ estadoEnvio }: { estadoEnvio: string | null }) {
  if (!estadoEnvio) return (
    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-400">
      Preparando envío
    </span>
  )
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${
      estadoEnvio === "Entregado" ? "bg-green-100 text-green-700" :
      estadoEnvio === "Novedad" ? "bg-red-100 text-red-500" :
      estadoEnvio === "En reparto" || estadoEnvio === "En tránsito" ? "bg-blue-100 text-blue-700" :
      "bg-yellow-100 text-yellow-700"
    }`}>
      {estadoEnvio}
    </span>
  )
}

const estadosEnvio = [
  "Pendiente de recolección", "Recolectado", "En bodega", "En tránsito",
  "En ciudad destino", "En reparto", "Entregado", "Novedad",
]

export default function MisPedidosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [expandidos, setExpandidos] = useState<number[]>([])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/perfil/pedidos")
  }, [status, router])

  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/perfil/pedidos")
      .then(res => res.json())
      .then(data => { if (data.pedidos) setPedidos(data.pedidos) })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [status])

  function toggleExpandido(id: number) {
    setExpandidos(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-verde border-t-transparent animate-spin"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Mis pedidos" }]}/>
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-verde">Mis pedidos</h1>
            <p className="text-sm text-gray-400">Hola, {session?.user?.name?.split(" ")[0]}</p>
          </div>
          <Link href="/perfil"
            className="text-xs text-verde border border-verde px-3 py-1.5 rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
            Mi perfil
          </Link>
        </div>

        {cargando ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-24"/>
                  <div className="h-4 bg-gray-200 rounded w-16"/>
                </div>
                <div className="h-3 bg-gray-200 rounded w-48 mb-2"/>
                <div className="h-3 bg-gray-200 rounded w-32"/>
              </div>
            ))}
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8"
              className="text-verde/20 mx-auto mb-4">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className="text-gray-400 text-sm mb-4">No tienes pedidos aún</p>
            <Link href="/catalogo"
              className="px-4 py-2 bg-verde text-amarillo text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidos.map(pedido => {
              const indexActual = estadosEnvio.indexOf(pedido.melonnOrderId || "")
              const productos: ItemPedido[] = pedido.productosJson ? JSON.parse(pedido.productosJson) : []
              const estaExpandido = expandidos.includes(pedido.id)

              return (
                <div key={pedido.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-amarillo/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-verde">
                        Pedido #{String(pedido.id).padStart(5, "0")}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {pedido.fechaPedido
                          ? new Date(pedido.fechaPedido).toLocaleDateString("es-CO", {
                              day: "numeric", month: "long", year: "numeric"
                            })
                          : "—"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-verde">
                      $ {pedido.total.toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <EstadoBadge estado={pedido.estadoPago}/>
                    <EnvioBadge estadoEnvio={pedido.melonnOrderId}/>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1 mb-3">
                    {pedido.direccionEntrega && (
                      <p>📍 {pedido.direccionEntrega}{pedido.ciudadEntrega ? `, ${pedido.ciudadEntrega}` : ""}</p>
                    )}
                    {pedido.metodoPago && <p>💳 {pedido.metodoPago}</p>}
                  </div>

                  {/* Productos del pedido */}
                  {productos.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <button
                        onClick={() => toggleExpandido(pedido.id)}
                        className="flex items-center gap-1 text-xs text-verde hover:text-amarillo transition-colors cursor-pointer mb-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                          className={`transition-transform ${estaExpandido ? "rotate-180" : ""}`}>
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                        {estaExpandido ? "Ocultar productos" : `Ver ${productos.length} producto${productos.length > 1 ? "s" : ""}`}
                      </button>
                      {estaExpandido && (
                        <div className="space-y-1.5">
                          {productos.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-verde font-medium truncate">{item.nombre}</p>
                                <p className="text-gray-400">x{item.cantidad} · $ {item.precio.toLocaleString("es-CO")} c/u</p>
                              </div>
                              <p className="text-verde font-semibold ml-3">
                                $ {(item.precio * item.cantidad).toLocaleString("es-CO")}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timeline de envío */}
                  {pedido.melonnOrderId && pedido.melonnOrderId !== "Novedad" && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <div className="flex gap-1 overflow-x-auto pb-1">
                        {estadosEnvio.filter(e => e !== "Novedad").map((e, i) => {
                          const activo = e === pedido.melonnOrderId
                          const pasado = indexActual > i
                          return (
                            <div key={e} className="flex flex-col items-center gap-1 min-w-[60px]">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                activo ? "bg-verde text-amarillo" :
                                pasado ? "bg-green-500 text-white" :
                                "bg-gray-100 text-gray-300"
                              }`}>
                                {pasado ? "✓" : i + 1}
                              </div>
                              <span className={`text-center leading-tight ${activo ? "text-verde font-medium" : "text-gray-300"}`}
                                style={{ fontSize: "9px" }}>
                                {e}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Guía Interrapidísimo */}
                  {pedido.guiaInterrapidisimo && (
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Guía: <span className="font-medium text-verde">{pedido.guiaInterrapidisimo}</span>
                      </div>
                      <a href={`https://www.interrapidisimo.com/rastrea-tu-envio/?guia=${pedido.guiaInterrapidisimo}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-verde hover:text-amarillo transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                        Rastrear envío →
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}