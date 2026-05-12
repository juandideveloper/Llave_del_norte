"use client"

import { useState } from "react"
import Link from "next/link"

export default function BannerCookies() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false
    return !localStorage.getItem("cookies_aceptadas")
  })

  function aceptar() {
    localStorage.setItem("cookies_aceptadas", "true")
    setVisible(false)
  }

  function rechazar() {
    localStorage.setItem("cookies_aceptadas", "false")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-verde border-t border-white/10 px-4 py-4 md:py-5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e1b86b" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          <p className="text-xs text-hueso/70 leading-relaxed">
            Usamos cookies técnicas necesarias para el funcionamiento del sitio. Al continuar navegando aceptas su uso.{" "}
            <Link href="/politica-privacidad" className="text-amarillo hover:underline">
              Más información
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={rechazar} className="text-xs text-hueso/50 hover:text-hueso transition-colors cursor-pointer px-3 py-1.5">
            Rechazar
          </button>
          <button onClick={aceptar} className="text-xs bg-amarillo text-verde font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}