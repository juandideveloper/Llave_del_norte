"use client"

import { useState } from "react"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"
import Link from "next/link"

interface ResultadoPedido {
  id: number
  estadoPago: string
  metodoPago: string | null
  total: number
  direccionEntrega: string | null
  ciudadEntrega: string | null
  fechaPedido: string | null
  melonnOrderId: string | null
}

const estadosMelonn: Record<number, string> = {
  1: "Recibido", 2: "Reservado", 3: "Picking", 4: "Recolectado",
  5: "Empacado", 7: "En tránsito", 8: "Entregado", 15: "Cancelado"
}

export default function RastreaPedidoPage() {
  const [numeroPedido, setNumeroPedido] = useState("")
  const [email, setEmail] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [pedido, setPedido] = useState<ResultadoPedido | null>(null)
  const [melonnInfo, setMelonnInfo] = useState<{ estado: string; trackingLink: string | null } | null>(null)

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    if (!numeroPedido || !email) return
    setCargando(true)
    setError("")
    setPedido(null)
    setMelonnInfo(null)

    try {
      const res = await fetch("/api/rastrea-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroPedido: numeroPedido.replace("#", "").replace("LLN-", "").trim(), email })
      })
      const data = await res.json()

      if (!data.ok) {
        setError(data.error || "No encontramos un pedido con esos datos")
        return
      }

      setPedido(data.pedido)

      // Si tiene orden Melonn rastrear
      if (data.pedido.melonnOrderId) {
        const melonnRes = await fetch(`/api/melonn/rastrear/${data.pedido.melonnOrderId}`)
        const melonnData = await melonnRes.json()
        if (melonnData.ok) {
          setMelonnInfo({
            estado: melonnData.orden?.sell_order_state?.name || "En proceso",
            trackingLink: melonnData.orden?.melonn_tracking_link || null
          })
        }
      }
    } catch {
      setError("Error al buscar el pedido. Intenta de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Rastrea tu pedido" }]}/>

      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-verde mb-2">Rastrea tu pedido</h1>
          <p className="text-sm text-gray-400">Ingresa el número de pedido y tu correo para ver el estado</p>
        </div>

        <form onSubmit={handleBuscar} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 mb-6">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Número de pedido</label>
            <input
              type="text"
              value={numeroPedido}
              onChange={e => setNumeroPedido(e.target.value)}
              placeholder="Ej: 00001 o LLN-1234567890"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button type="submit" disabled={cargando}
            className="w-full py-3 bg-verde text-amarillo text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
            {cargando ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-amarillo border-t-transparent animate-spin"/>
                Buscando...
              </>
            ) : "Rastrear pedido"}
          </button>
        </form>

        {/* Resultado */}
        {pedido && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-verde">
                Pedido #{String(pedido.id).padStart(5, "0")}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                pedido.estadoPago === "PAGADO" ? "bg-green-100 text-green-700" :
                pedido.estadoPago === "PENDIENTE" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-500"
              }`}>
                {pedido.estadoPago}
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-verde font-medium">$ {pedido.total.toLocaleString("es-CO")}</span>
              </div>
              {pedido.metodoPago && (
                <div className="flex justify-between">
                  <span>Método de pago</span>
                  <span className="text-verde">{pedido.metodoPago}</span>
                </div>
              )}
              {pedido.fechaPedido && (
                <div className="flex justify-between">
                  <span>Fecha</span>
                  <span className="text-verde">{new Date(pedido.fechaPedido).toLocaleDateString("es-CO")}</span>
                </div>
              )}
              {pedido.direccionEntrega && (
                <div className="flex justify-between">
                  <span>Dirección</span>
                  <span className="text-verde text-right max-w-48">{pedido.direccionEntrega}</span>
                </div>
              )}
            </div>

            {/* Estado envío */}
            <div className="pt-3 border-t border-gray-50">
              <p className="text-xs font-medium text-verde mb-2">Estado del envío</p>
              {!pedido.melonnOrderId ? (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"/>
                  Preparando tu pedido
                </div>
              ) : melonnInfo ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      melonnInfo.estado.includes("Entregado") ? "bg-green-500" :
                      melonnInfo.estado.includes("tránsito") ? "bg-blue-500" :
                      "bg-yellow-400"
                    }`}/>
                    <span className="text-verde">{melonnInfo.estado}</span>
                  </div>
                  {melonnInfo.trackingLink && (
                    <a href={melonnInfo.trackingLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-verde hover:text-amarillo transition-colors underline">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                      Ver tracking completo
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-blue-400"/>
                  Orden de envío creada
                </div>
              )}
            </div>

            <Link href="/perfil/pedidos"
              className="block w-full text-center py-2.5 border border-verde text-verde text-xs font-medium rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
              Ver todos mis pedidos
            </Link>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}