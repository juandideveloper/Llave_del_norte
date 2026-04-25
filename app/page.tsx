"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavbarHome from "@/components/ui/NavbarHome";
import { motion } from "framer-motion";
import Image from "next/image";
import "./globals.css";
import Footer from "@/components/ui/Footer";

interface ProductoAlegra {
  id: string;
  name: string;
  price: { price: number }[];
  category?: { name: string };
  images?: { id: number; url: string; favorite: boolean }[];
}

const resenas = [
  { id: 1, texto: "La calidad es excepcional. Instalé la serie Milano en mi baño principal y la diferencia con los grifos anteriores es abismal. Vale absolutamente cada peso.", autor: "Icónica", rol: "Arquitecta - Bogotá", inicial: "I" },
  { id: 2, texto: "Llevo 5 años especificando AQUA en mis proyectos de interiorismo. Nunca una queja, siempre el acabado perfecto. El servicio postventa es excelente.", autor: "Camilo Pardo", rol: "Bogotá", inicial: "C" },
  { id: 3, texto: "Llevo 5 años especificando AQUA en mis proyectos de interiorismo. Nunca una queja, siempre el acabado perfecto. El servicio postventa es excelente.", autor: "Camilo Pardo", rol: "Bogotá", inicial: "C" },
  { id: 4, texto: "La calidad es excepcional. Instalé la serie Milano en mi baño principal y la diferencia con los grifos anteriores es abismal. Vale absolutamente cada peso.", autor: "Icónica", rol: "Arquitecta - Bogotá", inicial: "I" },
];

const categorias = [
  { nombre: "Grifería de baño", productos: 60, image: "/images/CatalogoBaño.png" },
  { nombre: "Duchas", productos: 32, image: "images/CatalogoDuchas.png" },
  { nombre: "Cocina", productos: 50, image: "images/CatalogoCocina.png" },
  { nombre: "Lavabos", productos: 19, image: "images/CatalogoLavabos.png" },
  { nombre: "Accesorios", productos: 80, image: "images/CatalogoAccesorios.png" },
];

const chips = [
  { nombre: "Grifería", href: "/catalogo?categoria=griferia" },
  { nombre: "Lavaplatos", href: "/catalogo?categoria=lavaplatos" },
  { nombre: "Duchas", href: "/catalogo?categoria=duchas" },
  { nombre: "Válvulas", href: "/catalogo?categoria=valvulas" },
  { nombre: "Tornillerías", href: "/catalogo?categoria=tornillerias" },
  { nombre: "Accesorios", href: "/catalogo?categoria=accesorios" },
];

const LogoSVG = ({ fill = "#112221", width = "345.000000pt", height = "345.000000pt" }) => (
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width={width} height={height}
    viewBox="0 0 325.000000 321.000000" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,321.000000) scale(0.100000,-0.100000)" fill={fill} stroke="none">
      <path d="M2285 2775 c-138 -30 -257 -96 -374 -209 -176 -170 -290 -352 -424
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
120 -50 180 -81z"/>
    </g>
  </svg>
);

export default function HomePage() {
  const [chipActivo, setChipActivo] = useState("Grifería");
  const [sliderActual, setSliderActual] = useState(0);
  const [destacados, setDestacados] = useState<ProductoAlegra[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => {
        if (data.productos) {
          const filtrados = data.productos.filter(
            (p: ProductoAlegra) => p.category?.name === "Ventas"
          )
          setDestacados(filtrados)
        }
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  useEffect(() => {
    if (destacados.length === 0) return
    const timer = setInterval(() => {
      setSliderActual((prev) => prev === destacados.length - 1 ? 0 : prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [destacados]);

  return (
    <div className="min-h-screen bg-hueso">
      <NavbarHome/>

      {/* HERO */}
      <section id="inicio" className="fondo_Banner px-6 md:px-12 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs text-amarillo tracking-widest uppercase mb-4">Nueva Colección 2025</p>
          <h1 className="font text-4xl md:text-5xl text-hueso leading-tight mb-6">
            Grifería <br/>
            <span className="font text-amarillo">de diseño</span> <br/>
            para espacios <br/>
            únicos
          </h1>
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm md:text-base text-hueso/75">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="#fffaec" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.0354 19.399C6.01179 18.8872 5.49998 18.2264 5.49998 17.4167C5.49998 17.05 5.61074 16.7101 5.83227 16.3969C6.0538 16.0837 6.36317 15.8125 6.7604 15.5833L8.20415 16.9354C8.06665 16.9965 7.91769 17.0653 7.75727 17.1417C7.59685 17.2181 7.47081 17.3097 7.37915 17.4167C7.57776 17.6611 8.03609 17.875 8.75415 18.0583C9.4722 18.2417 10.2208 18.3333 11 18.3333C11.7791 18.3333 12.5316 18.2417 13.2573 18.0583C13.983 17.875 14.4451 17.6611 14.6437 17.4167C14.5368 17.2944 14.3993 17.1951 14.2312 17.1187C14.0632 17.0424 13.9028 16.9736 13.75 16.9125L15.1708 15.5375C15.5986 15.7819 15.9271 16.0608 16.1562 16.374C16.3854 16.6872 16.5 17.0347 16.5 17.4167C16.5 18.2264 15.9882 18.8872 14.9646 19.399C13.941 19.9108 12.6194 20.1667 11 20.1667C9.38054 20.1667 8.05901 19.9108 7.0354 19.399ZM11.0229 15.125C12.5354 14.0097 13.6736 12.8906 14.4375 11.7677C15.2014 10.6448 15.5833 9.51805 15.5833 8.3875C15.5833 6.82917 15.0868 5.65278 14.0937 4.85833C13.1007 4.06389 12.0694 3.66667 11 3.66667C9.93054 3.66667 8.89929 4.06389 7.90623 4.85833C6.91317 5.65278 6.41665 6.82917 6.41665 8.3875C6.41665 9.41111 6.79095 10.4767 7.53956 11.5844C8.28817 12.692 9.44929 13.8722 11.0229 15.125ZM11 17.4167C8.84581 15.8278 7.23783 14.2847 6.17602 12.7875C5.11422 11.2903 4.58331 9.82361 4.58331 8.3875C4.58331 7.30278 4.7781 6.35173 5.16769 5.53437C5.55727 4.71701 6.05762 4.03333 6.66873 3.48333C7.27984 2.93333 7.96734 2.52083 8.73123 2.24583C9.49512 1.97083 10.2514 1.83333 11 1.83333C11.7486 1.83333 12.5048 1.97083 13.2687 2.24583C14.0326 2.52083 14.7201 2.93333 15.3312 3.48333C15.9423 4.03333 16.4427 4.71701 16.8323 5.53437C17.2219 6.35173 17.4166 7.30278 17.4166 8.3875C17.4166 9.82361 16.8857 11.2903 15.8239 12.7875C14.7621 14.2847 13.1541 15.8278 11 17.4167ZM11 10.0833C11.5041 10.0833 11.9357 9.90382 12.2948 9.54479C12.6538 9.18576 12.8333 8.75417 12.8333 8.25C12.8333 7.74583 12.6538 7.31423 12.2948 6.95521C11.9357 6.59618 11.5041 6.41667 11 6.41667C10.4958 6.41667 10.0642 6.59618 9.70519 6.95521C9.34616 7.31423 9.16665 7.74583 9.16665 8.25C9.16665 8.75417 9.34616 9.18576 9.70519 9.54479C10.0642 9.90382 10.4958 10.0833 11 10.0833Z" fill="#fffaec"/>
              </svg>
              CALLE 65 #14-24, Bogotá, Colombia
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-sm md:text-base text-hueso/75">
                <svg width="22" height="22" viewBox="0 0 18 18" fill="#fffaec" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25001 12.75H9.75001V10.5H12V9H9.75001V6.75H8.25001V9H6.00001V10.5H8.25001V12.75ZM6.36564 15.9656C5.54689 15.6094 4.83439 15.1281 4.22814 14.5219C3.62189 13.9156 3.14064 13.2031 2.78439 12.3844C2.42814 11.5656 2.25001 10.6875 2.25001 9.75C2.25001 8.8125 2.42814 7.93438 2.78439 7.11563C3.14064 6.29688 3.62189 5.58438 4.22814 4.97813C4.83439 4.37188 5.54689 3.89063 6.36564 3.53438C7.18439 3.17813 8.06251 3 9.00001 3C9.93751 3 10.8156 3.17813 11.6344 3.53438C12.4531 3.89063 13.1656 4.37188 13.7719 4.97813C14.3781 5.58438 14.8594 6.29688 15.2156 7.11563C15.5719 7.93438 15.75 8.8125 15.75 9.75C15.75 10.6875 15.5719 11.5656 15.2156 12.3844C14.8594 13.2031 14.3781 13.9156 13.7719 14.5219C13.1656 15.1281 12.4531 15.6094 11.6344 15.9656C10.8156 16.3219 9.93751 16.5 9.00001 16.5C8.06251 16.5 7.18439 16.3219 6.36564 15.9656ZM4.20001 1.7625L5.25001 2.8125L2.06251 6L1.01251 4.95L4.20001 1.7625ZM13.8 1.7625L16.9875 4.95L15.9375 6L12.75 2.8125L13.8 1.7625ZM9.00001 15C10.4625 15 11.7031 14.4906 12.7219 13.4719C13.7406 12.4531 14.25 11.2125 14.25 9.75C14.25 8.2875 13.7406 7.04688 12.7219 6.02813C11.7031 5.00938 10.4625 4.5 9.00001 4.5C7.53751 4.5 6.29689 5.00938 5.27814 6.02813C4.25939 7.04688 3.75001 8.2875 3.75001 9.75C3.75001 11.2125 4.25939 12.4531 5.27814 13.4719C6.29689 14.4906 7.53751 15 9.00001 15Z" fill="#fffaec"/>
                </svg>
                LUN - SAB 8:00AM - 6:00PM
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base text-hueso/75">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fffaec" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.05C3 3.75 3.1 3.5 3.3 3.3C3.5 3.1 3.75 3 4.05 3H8.1C8.31667 3 8.5125 3.075 8.6875 3.225C8.8625 3.375 8.98333 3.56667 9.05 3.8L9.75 7.25C9.78333 7.48333 9.7625 7.72083 9.6875 7.9625C9.6125 8.20417 9.5 8.4 9.35 8.55L7 10.9C7.36667 11.5333 7.77083 12.1333 8.2125 12.7C8.65417 13.2667 9.13333 13.8083 9.65 14.325C10.1833 14.875 10.7375 15.3792 11.3125 15.8375C11.8875 16.2958 12.4833 16.6917 13.1 17.025L15.55 14.6C15.6833 14.4667 15.8417 14.375 16.025 14.325C16.2083 14.275 16.4333 14.2667 16.7 14.3L20.2 14.95C20.4167 14.9833 20.6042 15.0917 20.7625 15.275C20.9208 15.4583 21 15.6667 21 15.9V19.95C21 20.25 20.9 20.5 20.7 20.7C20.5 20.9 20.25 21 19.95 21C17.8667 21 15.8083 20.5458 13.775 19.6375C11.7417 18.7292 9.89167 17.4417 8.225 15.775C6.55833 14.1083 5.27083 12.2583 4.3625 10.225C3.45417 8.19167 3 6.13333 3 4.05ZM15 17.95C15.65 18.2333 16.3083 18.45 16.975 18.6C17.6417 18.75 18.3167 18.8667 19 18.95V16.75L16.65 16.3L15 17.95ZM6.1 9L7.75 7.35L7.25 5H5.05C5.1 5.68333 5.21667 6.35833 5.4 7.025C5.58333 7.69167 5.81667 8.35 6.1 9Z" fill="#fffaec"/>
                </svg>
                3134866451
              </div>
            </div>
          </div>
          <p className="text-sm md:text-lg text-hueso/75 max-w-xl leading-relaxed mt-3">
            Cada grifo es una obra de ingeniería y estética. Fabricados con materiales premium para baños y cocinas que merecen lo mejor.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center">
          <LogoSVG fill="#fffaec" width="345.000000pt" height="345.000000pt"/>
        </motion.div>
      </section>

      {/* CHIPS */}
      <section className="px-4 md:px-8 py-4 bg-black flex gap-3 overflow-x-auto justify-start md:justify-center">
        {chips.map((chip) => (
          <Link key={chip.nombre} href={chip.href} onClick={() => setChipActivo(chip.nombre)}
            className="text-sm px-5 py-2 rounded-full border whitespace-nowrap transition-all cursor-pointer border-white text-white hover:text-amarillo hover:border-amarillo">
            {chip.nombre}
          </Link>
        ))}
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="px-4 md:px-8 py-10 md:py-14 bg-verde">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs text-amarillo-oscuro tracking-widest uppercase mb-5">Explora por espacios</p>
            <h2 className="font text-3xl md:text-4xl font-medium text-hueso">Catálogo</h2>
          </div>
          <Link href="/catalogo" className="text-sm text-hueso/80 hover:text-amarillo transition-colors underline underline-offset-8">
            VER TODO EL CATÁLOGO
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-4xl mx-auto">
          <Link href="/catalogo?categoria=griferia-bano"
            className="relative rounded-lg overflow-hidden bg-verde-claro aspect-square cursor-pointer group"
            style={{ backgroundImage: `url(${categorias[0].image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-all"/>
            <div className="absolute bottom-4 left-4">
              <h3 className="font text-base md:text-xl font-medium text-white">{categorias[0].nombre}</h3>
              <p className="text-xs md:text-sm text-white/60">{categorias[0].productos} productos</p>
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            {categorias.slice(1).map((cat, i) => (
              <Link key={i} href={`/catalogo?categoria=${cat.nombre.toLowerCase().replace(/ /g, "-")}`}
                className="relative rounded-lg overflow-hidden bg-verde-claro aspect-square cursor-pointer group"
                style={{ backgroundImage: `url(${cat.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-all"/>
                <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3">
                  <h3 className="font text-sm md:text-base font-medium text-white">{cat.nombre}</h3>
                  <p className="text-xs text-white/60">{cat.productos} productos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section id="destacados" className="px-4 md:px-8 py-10 md:py-14 bg-hueso">
        <p className="text-xs text-amarillo-oscuro tracking-widest uppercase mb-2">Lo más vendido</p>
        <h2 className="font text-3xl md:text-4xl font-medium text-verde mb-8">
          Productos <br/> destacados
        </h2>

        {cargando ? (
          <div className="relative overflow-hidden px-10 md:px-12">
            <div className="flex gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[calc(100%-16px)] md:min-w-[calc(33.333%-16px)] bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 animate-pulse">
                  <div className="h-52 bg-gray-200"/>
                  <div className="p-4 space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-1/4"/>
                    <div className="h-3 bg-gray-200 rounded w-3/4"/>
                    <div className="h-3 bg-gray-200 rounded w-1/2"/>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : destacados.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No hay productos destacados aún</p>
        ) : (
          <>
            <div className="relative overflow-hidden px-10 md:px-12">
              <motion.div className="flex gap-4 md:gap-6"
                animate={{ x: `-${sliderActual * (100 / 3)}%` }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                {[...destacados, ...destacados].map((producto, i) => {
                  const precio = producto.price[0]?.price || 0
                  const imagenUrl = producto.images?.find(img => img.favorite)?.url || producto.images?.[0]?.url || null
                  return (
                    <Link key={i} href={`/catalogo/${producto.id}`}
                      className="min-w-[calc(100%-16px)] md:min-w-[calc(33.333%-16px)] bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 hover:border-amarillo transition-colors">
                      <div className="relative h-52 bg-verde/5">
                        {imagenUrl ? (
                          <Image src={imagenUrl} alt={producto.name} fill unoptimized className="object-contain"/>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-verde/20">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <path d="M3 9h18M9 21V9"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-verde/40 mb-1">{producto.category?.name}</p>
                        <h3 className="text-sm font-medium text-verde mb-2 line-clamp-2">{producto.name}</h3>
                        <p className="text-base font-medium text-verde">$ {Math.round(precio).toLocaleString("es-CO")} und</p>
                      </div>
                    </Link>
                  )
                })}
              </motion.div>

              <button onClick={() => setSliderActual(sliderActual === 0 ? destacados.length - 1 : sliderActual - 1)}
                className="group absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 hover:bg-verde flex items-center justify-center shadow-sm transition-colors z-10 cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 69 69" fill="none">
                  <path className="group-hover:fill-amarillo transition-colors duration-300"
                    d="M28.75 63.25L0 34.5L28.75 5.75002L33.8531 10.8531L10.2063 34.5L33.8531 58.1469L28.75 63.25Z" fill="#1C1B1F"/>
                </svg>
              </button>
              <button onClick={() => setSliderActual(sliderActual === destacados.length - 1 ? 0 : sliderActual + 1)}
                className="group absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-200 hover:bg-verde flex items-center justify-center shadow-sm transition-colors z-10 cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 69 69" fill="none">
                  <path className="group-hover:fill-amarillo transition-colors duration-300"
                    d="M40.25 5.75L69 34.5L40.25 63.25L35.1469 58.1469L58.7938 34.5L35.1469 10.8531L40.25 5.75Z" fill="#1C1B1F"/>
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              {destacados.map((_, i) => (
                <button key={i} onClick={() => setSliderActual(i)}
                  className={`rounded-full transition-all cursor-pointer ${sliderActual === i ? "w-6 h-2 bg-amarillo" : "w-3 h-3 bg-verde/30"}`}/>
              ))}
            </div>
          </>
        )}
      </section>

      {/* NUESTROS CLIENTES */}
      <section id="clientes" className="px-4 md:px-8 py-10 md:py-14 bg-verde border-t border-white/10">
        <p className="text-xs text-amarillo-oscuro tracking-widest uppercase mb-2">Lo que dicen</p>
        <h2 className="font text-3xl md:text-4xl font-medium text-hueso mb-8">Nuestros <br/> clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {resenas.map((resena) => (
            <motion.div key={resena.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }} viewport={{ once: true }}
              className="bg-white rounded-xl p-6 border border-gray-100">
              <span className="text-amarillo-oscuro text-7xl font-extralight">
                <svg width="16" height="16" viewBox="0 0 21 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.79493e-06 3.16808C6.79493e-06 2.59208 0.512007 2.01608 1.53601 1.44008C2.62401 0.864077 3.74401 0.480076 4.89601 0.288074C6.04801 0.096077 6.59201 0.160078 6.52801 0.480078L1.72801 26.4961C1.66401 26.6241 1.47201 26.7201 1.15201 26.7841C0.896007 26.8481 0.768007 26.7841 0.768007 26.5921L6.79493e-06 3.16808ZM13.44 3.16808C13.44 2.59208 13.952 2.01608 14.976 1.44008C16.064 0.864077 17.184 0.480076 18.336 0.288074C19.488 0.096077 20.032 0.160078 19.968 0.480078L15.168 26.4961C15.104 26.6241 14.912 26.7201 14.592 26.7841C14.336 26.8481 14.208 26.7841 14.208 26.5921L13.44 3.16808Z" fill="#98742d"/>
                </svg>
              </span>
              <p className="text-sm text-verde/70 leading-relaxed mt-2 mb-4">{resena.texto}</p>
              <div className="text-amarillo-oscuro text-sm mb-3">★★★★★</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-verde flex items-center justify-center">
                  <span className="text-amarillo text-sm font-medium">{resena.inicial}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-verde">{resena.autor}</p>
                  <p className="text-xs text-verde/40 uppercase tracking-wider">{resena.rol}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NUESTRA FILOSOFÍA */}
      <section id="filosofia" className="px-4 md:px-8 py-10 md:py-14 bg-hueso border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="font text-3xl md:text-4xl font-medium text-amarillo-oscuro mb-6">Nuestra filosofía</h2>
            <p className="text-base md:text-lg text-verde/90 leading-relaxed mb-8">
              En La Llave Del Norte, creemos que cada espacio y cada proyecto es una puerta hacia nuevas posibilidades. Nuestra misión es brindar las herramientas y la dirección necesarias para que nuestros clientes superen cualquier barrera.
            </p>
            <div className="flex gap-6 md:gap-8 mb-8">
              <div>
                <p className="text-2xl font-medium text-amarillo-oscuro">20+</p>
                <p className="text-xs text-amarillo-oscuro uppercase tracking-wider mt-1">Años de experiencia</p>
              </div>
              <div>
                <p className="text-2xl font-medium text-amarillo-oscuro">185+</p>
                <p className="text-xs text-amarillo-oscuro uppercase tracking-wider mt-1">Productos en catálogo</p>
              </div>
              <div>
                <p className="text-2xl font-medium text-amarillo-oscuro">100%</p>
                <p className="text-xs text-amarillo-oscuro uppercase tracking-wider mt-1">Clientes satisfechos</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center h-64">
            <LogoSVG fill="#112221" width="300.000000pt" height="300.000000pt"/>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
} 