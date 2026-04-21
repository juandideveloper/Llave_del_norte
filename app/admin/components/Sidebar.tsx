"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  aprobacionesPendientes?: number
}

interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
}

interface NavGroup {
  grupo: string
  items: NavItem[]
}

function Icon({ name }: { name: string }) {
  if (name === "grid") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  )
  if (name === "bag") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
  if (name === "truck") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
  if (name === "user") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
  if (name === "bell") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
  return null
}

export default function Sidebar({ aprobacionesPendientes = 0 }: SidebarProps) {
  const pathname = usePathname()

  const links: NavGroup[] = [
    { grupo: "GENERAL", items: [
      { href: "/admin", label: "Dashboard", icon: "grid" },
    ]},
    { grupo: "VENTAS", items: [
      { href: "/admin/pedidos", label: "Pedidos", icon: "bag" },
      { href: "/admin/importaciones", label: "Importaciones", icon: "truck" },
    ]},
    { grupo: "CLIENTES", items: [
      { href: "/admin/aprobaciones", label: "Aprobaciones", icon: "user", badge: aprobacionesPendientes },
    ]},
    { grupo: "CLIENTES", items: [
      { href: "/admin/suscriptores", label: "Suscriptores", icon: "bell" },
    ]},
  ]

  return (
    <aside className="w-52 min-h-screen bg-verde flex-shrink-0">
      <div className="p-5 border-b border-white/10">
        <p className="text-amarillo font-semibold text-base leading-tight">La llave del norte</p>
        <p className="text-white/40 text-xs mt-0.5">Panel de administración</p>
      </div>

      <nav className="p-3 space-y-5 mt-2">
        {links.map((grupo, gi) => (
          <div key={gi}>
            <p className="text-white/30 text-xs uppercase tracking-widest px-2 mb-1">{grupo.grupo}</p>
            <div className="space-y-0.5">
              {grupo.items.map((item) => {
                const activo = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activo ? "bg-amarillo/20 text-amarillo" : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}>
                    <Icon name={item.icon}/>
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}