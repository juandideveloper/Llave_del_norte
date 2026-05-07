"use client"

import { useState } from "react"

const estadosImportacion = ["CONFIRMADO", "PRODUCCION", "TRANSITO", "ADUANA", "BODEGA", "ENTREGADO"]

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

function BarraProgreso({ estadoActual }: { estadoActual: string }) {
  const indiceActual = estadosImportacion.indexOf(estadoActual)
  return (
    <div className="mt-3">
      <div className="flex items-center gap-1 mb-2">
        {estadosImportacion.map((estado, i) => (
          <div key={estado} className="flex-1">
            <div className={`h-2 w-full rounded-full transition-colors duration-300 ${
              i <= indiceActual ? "bg-amarillo" : "bg-black"
            }`}/>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        {estadosImportacion.map((e) => (
          <span key={e} className={`${estadoActual === e ? "text-amarillo font-medium" : ""}`}>
            {e.charAt(0) + e.slice(1).toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SelectorEstado({ importacionId, estadoActual, nombre }: { 
  importacionId: number
  estadoActual: string
  nombre: string
}) {
  const [estado, setEstado] = useState(estadoActual)
  const [guardando, setGuardando] = useState(false)

  async function handleChange(nuevoEstado: string) {
    setGuardando(true)
    try {
      const res = await fetch(`/api/importaciones/${importacionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
      })
      if (res.ok) setEstado(nuevoEstado)
      else alert("Error al actualizar el estado")
    } catch {
      alert("Error al actualizar el estado")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-base font-semibold text-verde">{nombre}</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full ${colorBadge(estado)}`}>
            {estado.charAt(0) + estado.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={estado}
              onChange={e => handleChange(e.target.value)}
              disabled={guardando}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-verde outline-none cursor-pointer appearance-none pr-8 disabled:opacity-50"
            >
              {estadosImportacion.map((e) => (
                <option key={e} value={e}>{e.charAt(0) + e.slice(1).toLowerCase()}</option>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          {guardando && <div className="w-3 h-3 rounded-full border border-verde border-t-transparent animate-spin"/>}
        </div>
      </div>
      <BarraProgreso estadoActual={estado}/>
    </div>
  )
}