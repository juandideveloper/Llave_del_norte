"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCarrito } from "@/context/CarritoContext";
import BuscadorProductos from "@/components/ui/BuscadorProductos";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);
  const { totalItems } = useCarrito();

  return (
    <nav className="navbar bg-hueso px-6 py-4 sticky top-0 z-50 border-b border-gray-400">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <a href="#inicio">
          <svg version="1.0" width="70.000000pt" height="70.000000pt" viewBox="0 0 3264.000000 1884.000000" preserveAspectRatio="xMidYMid meet" fill="#112221">
            <g transform="translate(0.000000,1884.000000) scale(0.100000,-0.100000)" fill="#112221" stroke="none">
              <path d="M3796 17839 c-7 -21 -33 -154 -46 -234 -6 -38 -20 -117 -30 -175 -10 -58 -26 -148 -35 -200 -9 -52 -23 -124 -30 -160 -8 -36 -23 -123 -35 -195 -12 -71 -27 -159 -35 -195 -7 -36 -18 -103 -25 -150 -6 -47 -17 -114 -25 -150 -8 -36 -23 -123 -35 -195 -12 -71 -30 -175 -41 -230 -11 -55 -24 -125 -30 -155 -5 -30 -14 -75 -19 -100 -5 -25 -17 -92 -25 -150 -9 -58 -24 -139 -32 -180 -9 -41 -19 -97 -24 -125 -4 -27 -12 -75 -18 -105 -22 -121 -84 -478 -92 -525 -11 -68 -45 -262 -64 -365 -8 -47 -20 -112 -25 -145 -6 -33 -14 -80 -19 -105 -22 -111 -53 -281 -86 -470 -19 -113 -40 -227 -46 -255 -6 -27 -21 -113 -34 -190 -13 -77 -40 -232 -60 -345 -20 -113 -47 -268 -60 -345 -13 -77 -38 -214 -55 -305 -17 -91 -43 -230 -56 -310 -14 -80 -29 -165 -33 -190 -61 -321 -132 -730 -134 -765 -2 -28 0 -30 37 -30 46 0 50 6 66 100 7 39 16 86 20 105 5 19 14 67 19 105 6 39 21 122 32 185 12 63 25 139 30 168 5 28 13 76 18 105 20 115 51 296 61 357 6 36 15 85 20 110 5 25 28 155 50 290 38 224 72 413 118 655 l17 90 559 3 c372 1 563 -1 570 -8 10 -10 47 -193 67 -330 10 -74 22 -143 40 -230 5 -25 21 -112 34 -195 14 -82 32 -188 41 -235 8 -47 19 -107 24 -135 4 -27 15 -88 24 -135 8 -47 25 -141 37 -210 11 -69 25 -145 29 -170 23 -121 53 -290 75 -430 14 -85 30 -165 35 -177 10 -23 11 -23 235 -23 171 0 227 3 230 13 3 6 -6 75 -20 152 -15 77 -39 219 -56 315 -16 96 -33 190 -38 210 -6 19 -15 73 -21 120 -6 47 -14 105 -19 130 -5 25 -21 117 -36 205 -14 88 -31 180 -36 205 -6 25 -19 95 -29 155 -28 160 -90 513 -100 565 -4 25 -13 72 -18 105 -6 33 -27 155 -47 270 -20 116 -40 235 -45 265 -5 30 -16 93 -24 140 -9 47 -23 130 -31 185 -9 55 -20 120 -25 145 -4 25 -13 72 -19 105 -6 33 -20 105 -31 160 -11 55 -27 147 -35 205 -9 58 -24 150 -35 205 -43 230 -79 433 -85 480 -3 28 -15 93 -25 145 -10 52 -22 118 -25 145 -4 28 -19 118 -35 200 -16 83 -32 177 -36 210 -3 33 -13 89 -21 125 -16 77 -31 154 -43 230 -28 177 -73 438 -90 520 -11 52 -29 151 -41 220 -11 69 -25 149 -30 178 -5 28 -13 76 -18 105 -79 473 -109 638 -116 645 -2 3 -7 -1 -9 -9z m-171 -1636 c4 -27 18 -104 31 -173 14 -69 32 -165 39 -215 20 -123 71 -413 90 -510 9 -44 20 -105 25 -135 5 -30 14 -82 20 -115 12 -66 20 -111 49 -293 11 -68 25 -147 31 -175 5 -29 24 -133 41 -232 16 -99 43 -250 59 -335 16 -85 36 -200 45 -255 9 -55 20 -120 25 -145 5 -25 18 -99 30 -165 12 -66 28 -153 36 -193 8 -40 12 -77 9 -83 -4 -5 -222 -9 -551 -9 -537 0 -544 0 -544 20 0 22 30 202 35 210 2 3 13 61 25 130 19 117 54 319 85 490 7 41 18 107 24 145 11 66 40 235 62 355 6 30 14 80 19 110 4 30 17 100 29 155 11 55 28 147 37 205 9 58 21 125 25 150 5 25 13 72 18 105 5 33 23 134 40 225 17 91 36 194 42 230 6 36 17 97 24 135 8 39 16 93 20 120 10 76 46 279 51 287 12 19 23 4 29 -39z"/>
            </g>
          </svg>
        </a>

        {/* Links */}
        <div className="hidden lg:grid grid-cols-3 gap-4 gap-y-3">
          <Link href="/catalogo" className="text-sm text-verde hover:text-amarillo-oscuro transition-colors uppercase tracking-wider">Catálogo</Link>
          <a href="#destacados" className="text-sm text-verde hover:text-amarillo-oscuro transition-colors uppercase tracking-wider">Productos destacados</a>
          <a href="#clientes" className="text-sm text-verde hover:text-amarillo-oscuro transition-colors uppercase tracking-wider">Nuestros clientes</a>
          <a href="#filosofia" className="text-sm text-verde hover:text-amarillo-oscuro transition-colors uppercase tracking-wider">Nuestra filosofía</a>
          <a href="#contacto" className="text-sm text-verde hover:text-amarillo-oscuro transition-colors uppercase tracking-wider">Contacto</a>
        </div>

        {/* Lado derecho */}
        <div className="ml-auto flex items-center gap-6">

          {/* Buscador desktop */}
          <div className="hidden lg:block">
            <BuscadorProductos
              bgClassName="bg-amarillo/30"
              inputClassName="text-verde placeholder-verde/50"
              iconColor="#112221"
            />
          </div>

          {/* Redes sociales */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="https://www.instagram.com/lallavedelnorte/" target="_blank" rel="noopener noreferrer" className="text-verde hover:text-amarillo-oscuro transition-colors">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@lallavedelnorte1" target="_blank" rel="noopener noreferrer" className="text-verde hover:text-amarillo-oscuro transition-colors">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
              </svg>
            </a>
            <a href="https://wa.me/573134866451" target="_blank" rel="noopener noreferrer" className="text-verde hover:text-amarillo-oscuro transition-colors">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>

          <div className="hidden lg:block w-px h-10 bg-verde/50"/>

          {/* Carrito */}
          <Link href="/carrito" className="relative group">
            <svg width="35" height="35" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path className="group-hover:fill-amarillo-oscuro transition-colors duration-300" fill="#112221" d="M11.9791 8.85417V5.72917H8.85415V4.6875H11.9791V1.5625H13.0208V4.6875H16.1458V5.72917H13.0208V8.85417H11.9791ZM6.50128 21.5435C6.20024 21.2423 6.04972 20.872 6.04972 20.4328C6.04972 19.9934 6.20024 19.6231 6.50128 19.3219C6.8025 19.0208 7.17281 18.8703 7.61222 18.8703C8.05163 18.8703 8.42185 19.0208 8.7229 19.3219C9.02411 19.6231 9.17472 19.9934 9.17472 20.4328C9.17472 20.872 9.02411 21.2423 8.7229 21.5435C8.42185 21.8447 8.05163 21.9953 7.61222 21.9953C7.17281 21.9953 6.8025 21.8447 6.50128 21.5435ZM16.2771 21.5435C15.9758 21.2423 15.8252 20.872 15.8252 20.4328C15.8252 19.9934 15.9758 19.6231 16.2771 19.3219C16.5781 19.0208 16.9483 18.8703 17.3877 18.8703C17.8271 18.8703 18.1975 19.0208 18.4987 19.3219C18.7997 19.6231 18.9502 19.9934 18.9502 20.4328C18.9502 20.872 18.7997 21.2423 18.4987 21.5435C18.1975 21.8447 17.8271 21.9953 17.3877 21.9953C16.9483 21.9953 16.5781 21.8447 16.2771 21.5435ZM2.08331 3.64583V2.60417H4.63331L8.90024 11.5786H15.8112C15.9315 11.5786 16.0383 11.5485 16.1318 11.4883C16.2253 11.4282 16.3054 11.3448 16.3721 11.238L20.014 4.6875H21.2018L17.2596 11.8068C17.1087 12.0606 16.9127 12.2596 16.6716 12.4039C16.4306 12.5482 16.1659 12.6203 15.8773 12.6203H8.43748L7.17133 14.944C7.06456 15.1043 7.06126 15.2779 7.16144 15.4648C7.26161 15.6518 7.41187 15.7453 7.61222 15.7453H18.9502V16.787H7.61222C7.00458 16.787 6.55015 16.5319 6.24894 16.0216C5.9479 15.5115 5.94156 14.9961 6.22993 14.4753L7.79633 11.6828L3.96639 3.64583H2.08331Z"/>
              </g>
            </svg>
            <span className="absolute -top-2 -right-3 bg-verde text-amarillo text-sm w-6 h-6 rounded-full flex items-center justify-center font-medium">{totalItems}</span>
          </Link>

          {/* Usuario */}
          {status === "loading" && <div className="w-8 h-8 rounded-full bg-verde animate-pulse"/>}

          {status === "unauthenticated" && (
            <Link href="/login" className="hidden lg:flex lg:flex-col lg:items-center items-center gap-2 text-sm font-medium py-1.5 text-verde hover:text-amarillo-oscuro transition-colors">
              <svg viewBox="0 0 640 640" width={35} height={35} fill="currentColor">
                <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/>
              </svg>
              Iniciar sesión
            </Link>
          )}

          {status === "authenticated" && session && (
            <div className="relative">
              <button onClick={() => setMenuAbierto(!menuAbierto)} className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-verde flex items-center justify-center">
                  <span className="text-amarillo text-xl font-medium">{session.user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="hidden lg:block text-base text-verde">{session.user?.name?.split(" ")[0]}</span>
              </button>
              <AnimatePresence>
                {menuAbierto && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-60 bg-gray-50 rounded-xl shadow-lg border border-gray-600 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-bold text-verde">{session.user?.name}</p>
                      <p className="text-xs font-bold text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/perfil/perfil" onClick={() => setMenuAbierto(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-verde hover:bg-verde hover:text-amarillo transition-colors">Mi perfil</Link>
                    <Link href="/perfil/pedidos" onClick={() => setMenuAbierto(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-verde hover:bg-verde hover:text-amarillo transition-colors">Mis pedidos</Link>
                    {session.user?.role === "ESPECIAL" && session.user?.estado === "APROBADO" && (
                      <Link href="/perfil/importaciones" onClick={() => setMenuAbierto(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-verde hover:bg-verde hover:text-amarillo transition-colors">Mis importaciones</Link>
                    )}
                    <button onClick={() => { setMenuAbierto(false); signOut({ callbackUrl: "/" }) }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-verde hover:text-amarillo transition-colors border-t border-gray-100 cursor-pointer">
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Hamburguesa */}
          <button onClick={() => setMenuMovil(!menuMovil)} className="lg:hidden text-verde cursor-pointer">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuMovil ? <path d="M18 6L6 18M6 6l12 12"/> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuMovil && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="lg:hidden overflow-hidden">
            <div className="pt-4 pb-2 space-y-1 border-t border-verde/20 mt-4">
              {([
                { href: "#catalogo", label: "Catálogo" },
                { href: "#destacados", label: "Productos destacados" },
                { href: "#clientes", label: "Nuestros clientes" },
                { href: "#filosofia", label: "Nuestra filosofía" },
                { href: "#contacto", label: "Contacto" },
              ] as { href: string; label: string }[]).map((link) => (
                <a key={link.href} href={link.href}
                  onClick={(e) => { e.preventDefault(); setMenuMovil(false); setTimeout(() => { const el = document.querySelector<HTMLElement>(link.href); if (el) el.scrollIntoView({ behavior: "smooth" }) }, 300) }}
                  className="block px-2 py-2.5 text-sm text-verde hover:text-amarillo transition-colors">
                  {link.label}
                </a>
              ))}

              {/* Buscador móvil */}
              <div className="px-2 mt-2">
                <BuscadorProductos bgClassName="bg-amarillo/30" inputClassName="text-verde placeholder-verde/50" iconColor="#112221"/>
              </div>

              <div className="flex items-center gap-4 px-2 py-3 border-t border-verde/20 mt-2">
                <a href="https://www.instagram.com/lallavedelnorte/" target="_blank" rel="noopener noreferrer" className="text-verde hover:text-amarillo transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="https://www.tiktok.com/@lallavedelnorte1" target="_blank" rel="noopener noreferrer" className="text-verde hover:text-amarillo transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
                </a>
                <a href="https://wa.me/573134866451" target="_blank" rel="noopener noreferrer" className="text-verde hover:text-amarillo transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>

              {status === "unauthenticated" && (
                <Link href="/login" onClick={() => setMenuMovil(false)} className="flex items-center gap-2 mx-2 mt-2 px-2 py-2.5 text-sm font-medium text-verde hover:text-amarillo transition-colors">
                  Iniciar sesión
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}