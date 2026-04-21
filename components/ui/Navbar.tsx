"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCarrito } from "@/context/CarritoContext";
interface NavbarProps {
  breadcrumb?: { label: string; href?: string }[];
}

export default function Navbar({ breadcrumb }: NavbarProps) {
  const { data: session, status } = useSession();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuMovil, setMenuMovil] = useState(false);
  const { totalItems } = useCarrito();

  return (
    <nav className="navbar bg-verde px-6 py-4 sticky top-0 z-50 ">
      <div className="flex items-center gap-8">
        <Link href="/">
         <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="60.000000pt"
          height="60.000000pt"
          viewBox="0 0 325.000000 321.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,321.000000) scale(0.100000,-0.100000)"
            fill="#C5973D"
            stroke="none"
          >
            <path
              d="M2285 2775 c-138 -30 -257 -96 -374 -209 -176 -170 -290 -352 -424
-676 -30 -74 -79 -193 -107 -263 -48 -116 -54 -127 -74 -121 -11 3 -29 14 -39
23 -17 17 -16 21 18 100 19 46 35 86 35 91 0 9 -31 22 -38 16 -2 -3 -19 -47
-37 -98 -30 -89 -33 -93 -63 -96 -39 -4 -62 -34 -62 -83 0 -46 23 -67 83 -75
26 -4 47 -11 47 -16 0 -32 -142 -226 -185 -253 -14 -10 -34 -11 -70 -5 -27 5
-93 9 -146 9 l-96 1 -21 73 c-27 97 -31 116 -42 232 -30 328 86 621 320 807
82 65 93 77 53 52 -61 -37 -162 -127 -211 -188 -110 -138 -165 -244 -209 -405
-23 -84 -26 -115 -26 -251 0 -127 4 -169 22 -234 11 -44 21 -82 21 -86 0 -4
-30 -15 -67 -24 -134 -34 -223 -96 -223 -155 0 -33 40 -73 89 -90 50 -16 182
-14 258 6 l66 16 21 -29 c11 -16 54 -64 95 -106 126 -132 272 -219 456 -274
81 -25 106 -27 255 -28 184 -1 259 13 414 78 79 33 84 33 188 29 152 -7 347
36 393 87 27 30 10 41 -38 24 -46 -17 -179 -14 -250 7 l-38 10 63 68 c146 154
250 369 272 561 5 45 2 38 -19 -40 -32 -125 -109 -277 -182 -365 -66 -78 -185
-183 -218 -191 -26 -6 -138 34 -430 156 -216 90 -413 163 -543 201 l-72 21 87
92 c162 170 240 295 435 696 220 453 260 524 371 658 116 140 233 202 381 202
78 0 136 -21 173 -61 26 -29 47 -79 33 -79 -6 0 -10 -9 -10 -20 0 -12 -7 -31
-15 -44 -8 -13 -14 -32 -13 -42 1 -10 -7 -48 -19 -84 -11 -36 -29 -114 -38
-173 -15 -89 -16 -110 -5 -117 17 -10 131 -33 137 -27 17 17 35 133 40 255 3
83 10 142 16 142 11 0 1 129 -14 169 -42 108 -238 167 -424 126z m-1337 -1734
c9 -5 -8 -18 -53 -41 -36 -18 -67 -31 -69 -29 -2 2 -14 24 -26 48 l-22 44 78
-7 c43 -4 84 -11 92 -15z m-235 -43 c15 -29 23 -56 19 -60 -4 -4 -52 -15 -106
-24 -158 -27 -223 7 -141 73 38 31 122 61 171 62 28 1 34 -5 57 -51z m602 -86
c61 -30 171 -89 245 -132 152 -87 272 -148 343 -175 26 -10 44 -22 40 -26 -4
-4 -52 -19 -107 -33 -187 -49 -414 -30 -590 48 -100 44 -220 132 -300 218 -42
45 -76 85 -76 90 0 4 26 21 58 37 31 17 75 41 97 55 l39 24 71 -25 c38 -14
120 -50 180 -81z"
            />
          </g>
        </svg>
        </Link>
        {/* Logo */}
       

        {/* Links pegados al logo */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/catalogo"
            className="text-sm text-white hover:text-amarillo transition-colors uppercase tracking-wider"
          >
            Catálogo
          </Link>

          <Link
            href="https://wa.me/573134866451"
            className="text-sm text-white hover:text-amarillo transition-colors uppercase tracking-wider"
          >
            Atención al cliente
          </Link>

          <Link
            href="/rastrea-pedido"
            className="text-sm text-white hover:text-amarillo transition-colors uppercase tracking-wider"
          >
            Rastrea tu pedido
          </Link>
        </div>

        {/* Lado derecho empujado con ml-auto */}
        <div className="ml-auto flex items-center gap-7">
          {/* Search */}
          <div className="hidden lg:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="bg-transparent text-white placeholder-white/40 text-xs outline-none w-36"
            />
          </div>

          {/* Redes sociales */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://www.instagram.com/lallavedelnorte/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amarillo transition-colors"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@lallavedelnorte1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amarillo transition-colors"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
              </svg>
            </a>
            <a
              href="https://wa.me/573134866451"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amarillo transition-colors"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>

          {/* Separador */}
          <div className="hidden lg:block w-px h-12 bg-white/20" />

          {/* Carrito */}
          <Link href="/carrito" className="relative group">
            <svg
              width="35"
              height="35"
              viewBox="0 0 25 25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  className="group-hover:fill-amarillo transition-colors duration-300"
                  fill="#ffff"
                  d="M11.9791 8.85417V5.72917H8.85415V4.6875H11.9791V1.5625H13.0208V4.6875H16.1458V5.72917H13.0208V8.85417H11.9791ZM6.50128 21.5435C6.20024 21.2423 6.04972 20.872 6.04972 20.4328C6.04972 19.9934 6.20024 19.6231 6.50128 19.3219C6.8025 19.0208 7.17281 18.8703 7.61222 18.8703C8.05163 18.8703 8.42185 19.0208 8.7229 19.3219C9.02411 19.6231 9.17472 19.9934 9.17472 20.4328C9.17472 20.872 9.02411 21.2423 8.7229 21.5435C8.42185 21.8447 8.05163 21.9953 7.61222 21.9953C7.17281 21.9953 6.8025 21.8447 6.50128 21.5435ZM16.2771 21.5435C15.9758 21.2423 15.8252 20.872 15.8252 20.4328C15.8252 19.9934 15.9758 19.6231 16.2771 19.3219C16.5781 19.0208 16.9483 18.8703 17.3877 18.8703C17.8271 18.8703 18.1975 19.0208 18.4987 19.3219C18.7997 19.6231 18.9502 19.9934 18.9502 20.4328C18.9502 20.872 18.7997 21.2423 18.4987 21.5435C18.1975 21.8447 17.8271 21.9953 17.3877 21.9953C16.9483 21.9953 16.5781 21.8447 16.2771 21.5435ZM2.08331 3.64583V2.60417H4.63331L8.90024 11.5786H15.8112C15.9315 11.5786 16.0383 11.5485 16.1318 11.4883C16.2253 11.4282 16.3054 11.3448 16.3721 11.238L20.014 4.6875H21.2018L17.2596 11.8068C17.1087 12.0606 16.9127 12.2596 16.6716 12.4039C16.4306 12.5482 16.1659 12.6203 15.8773 12.6203H8.43748L7.17133 14.944C7.06456 15.1043 7.06126 15.2779 7.16144 15.4648C7.26161 15.6518 7.41187 15.7453 7.61222 15.7453H18.9502V16.787H7.61222C7.00458 16.787 6.55015 16.5319 6.24894 16.0216C5.9479 15.5115 5.94156 14.9961 6.22993 14.4753L7.79633 11.6828L3.96639 3.64583H2.08331Z"
                />
              </g>
            </svg>
            <span className="absolute -top-2 -right-3 bg-yellow-100 text-verde text-sm w-6 h-6 rounded-full flex items-center justify-center font-medium">
              {totalItems}
            </span>
          </Link>

          {/* Usuario */}
          {status === "loading" && (
            <div className="w-8 h-8 rounded-full bg-amarillo animate-pulse" />
          )}

          {status === "unauthenticated" && (
            <Link
              href="/login"
              className="hidden lg:flex lg:flex-col lg:items-center items-center gap-2 text-sm font-medium px-4 py-1.5 text-white hover:text-amarillo transition-colors"
            >
              <svg
                viewBox="0 0 640 640"
                width={35}
                height={35}
                fill="currentColor"
              >
                <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" />
              </svg>
              Iniciar sesión
            </Link>
          )}

          {status === "authenticated" && session && (
            <div className="relative">
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <span className="text-verde text-xl font-medium">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden lg:block text-base text-white">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </button>

              <AnimatePresence>
                {menuAbierto && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-60 bg-gray-50 rounded-xl shadow-lg border border-gray-600 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-bold text-verde">
                        {session.user?.name}
                      </p>
                      <p className="text-xs font-bold text-gray-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/perfil"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-verde hover:bg-verde hover:text-amarillo transition-colors"
                    >
                      Mi perfil
                    </Link>
                    <Link
                      href="/perfil/pedidos"
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-verde hover:bg-verde hover:text-amarillo transition-colors"
                    >
                      Mis pedidos
                    </Link>
                    {session.user?.role === "ESPECIAL" &&
                      session.user?.estado === "APROBADO" && (
                        <Link
                          href="/perfil/importaciones"
                          onClick={() => setMenuAbierto(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-verde hover:bg-verde hover:text-amarillo transition-colors"
                        >
                          Mis importaciones
                        </Link>
                      )}
                    <button
                      onClick={() => {
                        setMenuAbierto(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-verde hover:text-amarillo transition-colors border-t border-gray-100 cursor-pointer"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Menú hamburguesa móvil */}
          <button
            onClick={() => setMenuMovil(!menuMovil)}
            className="lg:hidden text-amarillo cursor-pointer"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {menuMovil ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuMovil && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="pt-4 pb-2 space-y-1 border-t border-white/10 mt-4">
              {[
                { href: "/catalogo", label: "Catalogo" },
                {
                  href: "https://wa.me/573134866451",
                  label: "Atención al cliente",
                },
                { href: "rastrea-pedido", label: "Rastrea tu pedido" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuMovil(false)}
                  className="block px-2 py-2.5 text-sm text-white/70 hover:text-amarillo transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {/* Search móvil */}
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 mx-2 mt-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4-4" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="bg-transparent text-white placeholder-white/40 text-xs outline-none w-full"
                />
              </div>

              {/* Redes móvil */}
              <div className="flex items-center gap-4 px-2 py-3 border-t border-white/10 mt-2">
                <a
                  href="https://www.instagram.com/lallavedelnorte/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-amarillo transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@lallavedelnorte1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-amarillo transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/573134866451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-amarillo transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>

              {status === "unauthenticated" && (
                <Link
                  href="/login"
                  onClick={() => setMenuMovil(false)}
                  className="flex items-center gap-2 mx-2 mt-2 px-2 py-2.5 text-sm  font-medium rounded-full text-white/70  hover:text-amarillo transition-colors"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Breadcrumb — solo si se pasa como prop */}
      {breadcrumb && (
        <div className="px-6 py-2 border-t border-white/40 text-xs text-white/50">
          {breadcrumb.map((item, i) => (
            <span key={i}>
              {i > 0 && " / "}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-amarillo transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-amarillo">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </nav>
  );
}
