"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import NavbarHome from "@/components/ui/NavbarHome"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/ui/Navbar"
import "./globals.css";

// Datos de placeholder para productos destacados
const productosDestacados = [
  { id: 1, nombre: "Sanitario Inteligente", categoria: "Baño", precio: "$00.000", badge: "Nuevo" },
  { id: 2, nombre: "Luces colgantes", categoria: "Cocina", precio: "$00.000", badge: null },
  { id: 3, nombre: "Ducha de filtro", categoria: "Duchas", precio: "$00.000", badge: "Oferta" },
  { id: 4, nombre: "Grifería Milano", categoria: "Grifería", precio: "$00.000", badge: "Nuevo" },
  { id: 5, nombre: "Lavabo Premium", categoria: "Lavabos", precio: "$00.000", badge: null },
]

// Datos de placeholder para reseñas
const resenas = [
  {
    id: 1,
    texto: "La calidad es excepcional. Instalé la serie Milano en mi baño principal y la diferencia con los grifos anteriores es abismal. Vale absolutamente cada peso.",
    autor: "Icónica",
    rol: "Arquitecta - Bogotá",
    inicial: "I"
  },
  {
    id: 2,
    texto: "Llevo 5 años especificando AQUA en mis proyectos de interiorismo. Nunca una queja, siempre el acabado perfecto. El servicio postventa es excelente.",
    autor: "Camilo Pardo",
    rol: "Bogotá",
    inicial: "C"
  },
]

// Categorías del catálogo
const categorias = [
  { nombre: "Grifería de baño", productos: 60 },
  { nombre: "Duchas", productos: 32 },
  { nombre: "Cocina", productos: 50 },
  { nombre: "Lavabos", productos: 19 },
  { nombre: "Accesorios", productos: 80 },
]

// Chips de filtro
const chips = ["Grifería", "Lavaplatos", "Duchas", "Válvulas", "Tornillerías", "Accesorios"]

export default function HomePage() {
  const [chipActivo, setChipActivo] = useState("Grifería")
  const [sliderActual, setSliderActual] = useState(0)

  // Auto-avance del slider cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setSliderActual((prev) =>
        prev === productosDestacados.length - 1 ? 0 : prev + 1
      )
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-hueso">
      <NavbarHome/>

      {/* ── HERO ── */}
      <section id="inicio" className="px-8 py-12 grid grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs text-amarillo tracking-widest uppercase mb-4">
            Nueva Colección 2025
          </p>
          <h1 className="text-5xl font-medium text-verde leading-tight mb-6"
            style={{ fontFamily: "Georgia, serif" }}>
            Grifería <br />
            <span className="text-amarillo">de diseño</span> <br />
            para espacios <br />
            únicos
          </h1>
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-verde/60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
              </svg>
              CALLE 65 #14-24, Bogotá, Colombia
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-verde/60">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                LUN - SAB 8:00AM - 6:00PM
              </div>
              <div className="flex items-center gap-2 text-sm text-verde/60">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                3134866451
              </div>
            </div>
          </div>
          <p className="text-sm text-verde/50 max-w-xs leading-relaxed">
            Cada grifo es una obra de ingeniería y estética. Fabricados con
            materiales premium para baños y cocinas que merecen lo mejor.
          </p>
        </motion.div>

        {/* Logo grande decorativo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <span className="text-verde select-none"
            style={{ fontSize: "280px", fontFamily: "Georgia, serif", lineHeight: 1 }}>
            L
          </span>
        </motion.div>
      </section>

      {/* ── CHIPS DE CATEGORÍAS ── */}
      <section className="px-8 py-4 bg-verde-claro flex gap-3 overflow-x-auto">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => setChipActivo(chip)}
            className={`text-sm px-5 py-2 rounded-full border whitespace-nowrap transition-all ${
              chipActivo === chip
                ? "bg-amarillo text-verde border-amarillo font-medium"
                : "border-white/20 text-white/60 hover:text-white"
            }`}
          >
            {chip}
          </button>
        ))}
      </section>

      {/* ── CATÁLOGO ── */}
      <section id="catalogo" className="px-8 py-14 bg-verde">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs text-amarillo tracking-widest uppercase mb-2">
              Explora por espacios
            </p>
            <h2 className="text-4xl font-medium text-hueso"
              style={{ fontFamily: "Georgia, serif" }}>
              Catalogo
            </h2>
          </div>
          <Link href="/catalogo"
            className="text-sm text-hueso/60 hover:text-amarillo transition-colors underline underline-offset-4">
            Ver todo el catálogo
          </Link>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-3 gap-2">
          {/* Categoría grande */}
          <div className="row-span-2 relative rounded-lg overflow-hidden bg-verde-claro h-80 cursor-pointer group">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-medium text-white"
                style={{ fontFamily: "Georgia, serif" }}>
                {categorias[0].nombre}
              </h3>
              <p className="text-sm text-white/60">{categorias[0].productos} productos</p>
            </div>
          </div>

          {/* Categorías pequeñas */}
          {categorias.slice(1).map((cat, i) => (
            <div key={i}
              className="relative rounded-lg overflow-hidden bg-verde-claro h-[154px] cursor-pointer group">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />
              <div className="absolute bottom-3 left-3">
                <h3 className="text-base font-medium text-white"
                  style={{ fontFamily: "Georgia, serif" }}>
                  {cat.nombre}
                </h3>
                <p className="text-xs text-white/60">{cat.productos} productos</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS (SLIDER) ── */}
      <section id="destacados" className="px-8 py-14 bg-hueso">
        <p className="text-xs text-amarillo tracking-widest uppercase mb-2">
          Lo más vendido
        </p>
        <h2 className="text-4xl font-medium text-verde mb-8"
          style={{ fontFamily: "Georgia, serif" }}>
          Productos <br /> destacados
        </h2>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${sliderActual * (100 / 3)}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {productosDestacados.map((producto) => (
              <div key={producto.id}
                className="min-w-[calc(33.333%-16px)] bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                {/* Imagen placeholder */}
                <div className="h-52 bg-verde/5 relative flex items-center justify-center">
                  {producto.badge && (
                    <span className={`absolute top-3 left-3 text-xs font-medium px-3 py-1 rounded-full ${
                      producto.badge === "Nuevo"
                        ? "bg-verde text-amarillo"
                        : "bg-red-500 text-white"
                    }`}>
                      {producto.badge}
                    </span>
                  )}
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="0.8" className="text-verde/20">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                </div>
                <div className="p-4">
                  <p className="text-xs text-verde/40 mb-1">{producto.categoria}</p>
                  <h3 className="text-sm font-medium text-verde mb-2">{producto.nombre}</h3>
                  <p className="text-base font-medium text-verde">{producto.precio}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Controles del slider */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {productosDestacados.map((_, i) => (
            <button
              key={i}
              onClick={() => setSliderActual(i)}
              className={`rounded-full transition-all ${
                sliderActual === i
                  ? "w-6 h-2 bg-verde"
                  : "w-2 h-2 bg-verde/20"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── NUESTROS CLIENTES ── */}
      <section id="clientes" className="px-8 py-14 bg-hueso border-t border-gray-100">
        <p className="text-xs text-amarillo tracking-widest uppercase mb-2">
          Lo que dicen
        </p>
        <h2 className="text-4xl font-medium text-verde mb-8"
          style={{ fontFamily: "Georgia, serif" }}>
          Nuestros <br /> clientes
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {resenas.map((resena) => (
            <motion.div
              key={resena.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 border border-gray-100"
            >
              <span className="text-amarillo text-3xl font-serif"></span>
              <p className="text-sm text-verde/70 leading-relaxed mt-2 mb-4">
                {resena.texto}
              </p>
              <div className="text-amarillo text-sm mb-3">★★★★★</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-verde flex items-center justify-center">
                  <span className="text-amarillo text-sm font-medium">
                    {resena.inicial}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-verde">{resena.autor}</p>
                  <p className="text-xs text-verde/40 uppercase tracking-wider">
                    {resena.rol}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NUESTRA FILOSOFÍA ── */}
      <section id="filosofia" className="px-8 py-14 bg-hueso border-t border-gray-100">
        <p className="text-xs text-amarillo tracking-widest uppercase mb-2">
          Nuestra filosofía
        </p>
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-medium text-verde mb-6"
              style={{ fontFamily: "Georgia, serif" }}>
              Lema
            </h2>
            <p className="text-sm text-verde/60 leading-relaxed mb-8">
              Llevamos más de 20 años diseñando grifería de alta gama para
              arquitectos, diseñadores de interiores y clientes que exigen lo
              mejor. Cada pieza pasa por 40 puntos de control de calidad antes
              de llegar a tus manos.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-8">
              <div>
                <p className="text-2xl font-medium text-amarillo">20+</p>
                <p className="text-xs text-verde/40 uppercase tracking-wider mt-1">
                  Años de experiencia
                </p>
              </div>
              <div>
                <p className="text-2xl font-medium text-amarillo">185+</p>
                <p className="text-xs text-verde/40 uppercase tracking-wider mt-1">
                  Productos en catálogo
                </p>
              </div>
              <div>
                <p className="text-2xl font-medium text-amarillo">100%</p>
                <p className="text-xs text-verde/40 uppercase tracking-wider mt-1">
                  Clientes satisfechos
                </p>
              </div>
            </div>

            <button className="text-sm text-verde border-b border-verde pb-0.5 hover:text-amarillo hover:border-amarillo transition-colors">
              CONOCE NUESTRA HISTORIA
            </button>
          </div>

          {/* Logo decorativo */}
          <div className="border border-verde/20 rounded-lg flex items-center justify-center h-64">
            <span className="text-verde select-none"
              style={{ fontSize: "160px", fontFamily: "Georgia, serif", lineHeight: 1 }}>
              L
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contacto" className="bg-verde px-8 py-12">
        <div className="grid grid-cols-3 gap-8 mb-8">

          {/* Columna 1 - Info */}
          <div>
            <p className="text-hueso/50 text-xs uppercase tracking-wider mb-1">
              La Llave del
            </p>
            <p className="text-amarillo font-medium mb-6"
              style={{ fontFamily: "Georgia, serif" }}>
              Norte
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-hueso/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0">
                  <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
                </svg>
                CALLE 65 #14-24, <br /> Bogotá, Colombia
              </div>
              <div className="flex items-center gap-2 text-sm text-hueso/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                3134866451
              </div>
              <div className="flex items-center gap-2 text-sm text-hueso/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                al.lallavedelnorte1@gmail.com
              </div>
            </div>
          </div>

          {/* Columna 2 - Links */}
          <div>
            <p className="text-hueso/40 text-xs uppercase tracking-wider mb-6">
              Acerca de
            </p>
            <div className="space-y-3">
              {["Nuestra infraestructura", "Equipo", "Afiliados", "Accede a tu cuenta"].map((link) => (
                <p key={link}
                  className="text-sm text-hueso/60 hover:text-amarillo transition-colors cursor-pointer">
                  {link}
                </p>
              ))}
            </div>
          </div>

          {/* Columna 3 - Suscripción */}
          <div className="bg-verde-claro rounded-lg p-6">
            <p className="text-xs text-hueso/60 uppercase tracking-wider mb-1">
              Suscríbete
            </p>
            <p className="text-sm text-hueso/80 mb-4">
              Recibe ofertas, novedades y mucho más
            </p>
            <input
              type="email"
              placeholder="Ingresa tu email"
              className="w-full px-3 py-2.5 rounded-md text-sm bg-verde border border-white/10 text-hueso placeholder-hueso/30 outline-none focus:border-amarillo mb-3"
            />
            <div className="flex items-start gap-2 mb-4">
              <input type="checkbox" className="mt-0.5 accent-amarillo" />
              <p className="text-xs text-hueso/40 leading-relaxed">
                He leído y acepto la política de privacidad
              </p>
            </div>
            <button className="w-full py-2.5 bg-verde text-hueso text-sm font-medium rounded-md hover:opacity-90 transition-opacity border border-white/10">
              Quiero suscribirme
            </button>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-white/10 pt-6 flex justify-between items-center">
          <p className="text-xs text-hueso/40">
            © 2025 LA LLAVE DEL NORTE. <br />
            Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-hueso/40">¡Síguenos!</p>
            {/* WhatsApp */}
            <a href="#" className="text-hueso/50 hover:text-amarillo transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" className="text-hueso/50 hover:text-amarillo transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="text-hueso/50 hover:text-amarillo transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}