"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"

interface Producto {
  id: string
  name: string
  price: { price: number }[]
  category?: { name: string }
  images?: { id: number; url: string; favorite: boolean }[]
  status: string
}

interface Props {
  inputClassName?: string
  iconColor?: string
  bgClassName?: string
}

export default function BuscadorProductos({ inputClassName, iconColor = "white", bgClassName }: Props) {
  const [query, setQuery] = useState("")
  const [productos, setProductos] = useState<Producto[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => {
        if (data.productos) {
          setProductos(data.productos.filter((p: Producto) => p.status === "active"))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const resultados = useMemo(() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase()
    return productos.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category?.name.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [query, productos])

  const abierto = query.trim().length >= 2

  function handleSelect(id: string) {
    setQuery("")
    router.push(`/catalogo/${id}`)
  }

  return (
    <div ref={ref} className="relative">
      <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${bgClassName}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-4-4"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          className={`bg-transparent text-xs outline-none w-36 ${inputClassName}`}
        />
        {query && (
          <button onClick={() => setQuery("")} className="opacity-50 hover:opacity-100 cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {abierto && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {resultados.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400">
              Sin resultados para {query}
            </div>
          ) : (
            <div>
              {resultados.map(prod => {
                const precio = prod.price[0]?.price || 0
                const imagenUrl = prod.images?.find(img => img.favorite)?.url || prod.images?.[0]?.url || null
                return (
                  <button key={prod.id} onClick={() => handleSelect(prod.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 cursor-pointer">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                      {imagenUrl ? (
                        <img src={imagenUrl} alt={prod.name} className="w-full h-full object-contain"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-verde/20">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M3 9h18M9 21V9"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-verde truncate">{prod.name}</p>
                      <p className="text-xs text-gray-400">${Math.round(precio).toLocaleString("es-CO")}</p>
                    </div>
                  </button>
                )
              })}
              <button
                onClick={() => { router.push("/catalogo"); setQuery("") }}
                className="w-full text-center text-xs text-verde py-3 hover:bg-gray-50 transition-colors cursor-pointer border-t border-gray-100">
                Ver todos los productos →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}