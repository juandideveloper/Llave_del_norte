"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const estadosImportacion = ["CONFIRMADO", "PRODUCCION", "TRANSITO", "ADUANA", "BODEGA", "ENTREGADO"]

interface Pedido {
  id: number
  cliente: { nombre: string; email: string }
  total: number
  estadoPago: string
}

export default function NuevaImportacionPage() {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  const [nombre, setNombre] = useState("")
  const [proveedor, setProveedor] = useState("")
  const [estado, setEstado] = useState("CONFIRMADO")
  const [paisOrigen, setPaisOrigen] = useState("")
  const [numeroContenedor, setNumeroContenedor] = useState("")
  const [notas, setNotas] = useState("")
  const [fechaEstimada, setFechaEstimada] = useState("")

  // Pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState<number[]>([])
  const [cargandoPedidos, setCargandoPedidos] = useState(false)

  useEffect(() => {
    setCargandoPedidos(true)
    fetch("/api/pedidos?estadoPago=PAGADO")
      .then(res => res.json())
      .then(data => {
        if (data.pedidos) setPedidos(data.pedidos)
        else if (Array.isArray(data)) setPedidos(data)
      })
      .catch(() => {})
      .finally(() => setCargandoPedidos(false))
  }, [])

  const pedidosFiltrados = pedidos.filter(p =>
    `#${String(p.id).padStart(5, "0")}`.includes(busqueda) ||
    p.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.cliente.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  function togglePedido(id: number) {
    setPedidosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre || !proveedor) {
      setError("Nombre y proveedor son obligatorios")
      return
    }
    setCargando(true)
    try {
      const res = await fetch("/api/importaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre, proveedor, estado,
          paisOrigen: paisOrigen || null,
          numeroContenedor: numeroContenedor || null,
          notas: notas || null,
          fechaEstimada: fechaEstimada || null,
          pedidosIds: pedidosSeleccionados,
        })
      })
      const data = await res.json()
      if (data.ok) {
        router.push("/admin/importaciones")
      } else {
        setError("Error al crear la importación")
      }
    } catch {
      setError("Error al crear la importación")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-hueso">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/importaciones" className="text-gray-400 hover:text-verde transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold text-verde">Nueva Importación</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Datos principales */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-verde mb-4">Datos de la importación</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Nombre <span className="text-red-500">*</span></label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                  placeholder="Ej: Contenedor Asia — Enero 2025"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Proveedor <span className="text-red-500">*</span></label>
                <input type="text" value={proveedor} onChange={e => setProveedor(e.target.value)}
                  placeholder="Nombre del proveedor"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Estado inicial</label>
                <div className="relative">
                  <select value={estado} onChange={e => setEstado(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none appearance-none cursor-pointer">
                    {estadosImportacion.map(e => (
                      <option key={e} value={e}>{e.charAt(0) + e.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">País de origen</label>
                <input type="text" value={paisOrigen} onChange={e => setPaisOrigen(e.target.value)}
                  placeholder="Ej: China, España..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Número de contenedor</label>
                <input type="text" value={numeroContenedor} onChange={e => setNumeroContenedor(e.target.value)}
                  placeholder="Ej: MSCU1234567"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Fecha estimada de llegada</label>
                <input type="date" value={fechaEstimada} onChange={e => setFechaEstimada(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Notas</label>
                <textarea value={notas} onChange={e => setNotas(e.target.value)}
                  placeholder="Detalles adicionales..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde resize-none"/>
              </div>
            </div>
          </div>

          {/* Pedidos asociados */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-verde">Pedidos asociados</h2>
              {pedidosSeleccionados.length > 0 && (
                <span className="text-xs bg-verde text-amarillo px-2 py-0.5 rounded-full">
                  {pedidosSeleccionados.length} seleccionados
                </span>
              )}
            </div>

            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por # pedido o cliente..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde mb-3"/>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {cargandoPedidos ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-5 h-5 rounded-full border-2 border-verde border-t-transparent animate-spin"/>
                </div>
              ) : pedidosFiltrados.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  {busqueda ? "No se encontraron pedidos" : "No hay pedidos pagados disponibles"}
                </p>
              ) : pedidosFiltrados.map(pedido => {
                const seleccionado = pedidosSeleccionados.includes(pedido.id)
                return (
                  <div
                    key={pedido.id}
                    onClick={() => togglePedido(pedido.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      seleccionado ? "border-verde bg-verde/5" : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        seleccionado ? "border-verde bg-verde" : "border-gray-300"
                      }`}>
                        {seleccionado && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-verde">
                          #{String(pedido.id).padStart(5, "0")} · {pedido.cliente.nombre}
                        </p>
                        <p className="text-xs text-gray-400">{pedido.cliente.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-verde">
                        $ {pedido.total.toLocaleString("es-CO")}
                      </p>
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        {pedido.estadoPago}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3">
            <Link href="/admin/importaciones"
              className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium text-center rounded-lg hover:border-verde hover:text-verde transition-colors">
              Cancelar
            </Link>
            <button type="submit" disabled={cargando}
              className="flex-1 py-2.5 bg-verde text-amarillo text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
              {cargando ? "Creando..." : `Crear importación${pedidosSeleccionados.length > 0 ? ` con ${pedidosSeleccionados.length} pedidos` : ""}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}