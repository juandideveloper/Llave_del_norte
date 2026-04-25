"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/ui/Footer";
import ModalCarrito from "@/components/ui/ModalCarrito";
import { useCarrito } from "@/context/CarritoContext";

interface ProductoAlegra {
  id: string;
  name: string;
  description: string | null;
  reference: string | null;
  price: { price: number }[];
  inventory: { availableQuantity: number };
  status: string;
  category?: { name: string };
  images?: { id: number; url: string; favorite: boolean }[];
}

function Estrellas({
  cantidad,
  size = "base",
}: {
  cantidad: number;
  size?: "base" | "lg";
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`${size === "lg" ? "text-2xl" : "text-base"} ${i <= cantidad ? "text-amarillo" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function DetalleProductoPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const esEspecial =
    session?.user?.role === "ESPECIAL" && session?.user?.estado === "APROBADO";

  const [producto, setProducto] = useState<ProductoAlegra | null>(null);
  const [cargando, setCargando] = useState(true);
  const [imagenActual, setImagenActual] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [botonDesbloqueado, setBotonDesbloqueado] = useState(false);
  const [mostrarFlotante, setMostrarFlotante] = useState(false);
  const [descripcionAbierta, setDescripcionAbierta] = useState(true);
  const [fichaTecnicaAbierta, setFichaTecnicaAbierta] = useState(false);
  const [sliderRelacionados, setSliderRelacionados] = useState(0);
  const [guardado, setGuardado] = useState(false);
  const especificacionesRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { agregarItem } = useCarrito();

useEffect(() => {
  fetch(`/api/productos/${id}`)
    .then(res => res.json())
    .then(data => {
      console.log("Producto:", data)
      console.log("Imágenes:", data.producto?.images)
      if (data.producto) setProducto(data.producto)
      setCargando(false)
    })
    .catch(() => setCargando(false))
}, [id])
  useEffect(() => {
    const handleScroll = () => {
      if (especificacionesRef.current) {
        const rect = especificacionesRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight) setBotonDesbloqueado(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setMostrarFlotante(!entries[0].isIntersecting);
      },
      { threshold: 0.1 },
    );
    if (infoPanelRef.current) observer.observe(infoPanelRef.current);
    return () => observer.disconnect();
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          breadcrumb={[
            { label: "Inicio", href: "/" },
            { label: "Catálogo", href: "/catalogo" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-verde border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          breadcrumb={[
            { label: "Inicio", href: "/" },
            { label: "Catálogo", href: "/catalogo" },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-400 text-sm mb-4">Producto no encontrado</p>
          <Link
            href="/catalogo"
            className="px-4 py-2 bg-verde text-amarillo rounded-lg text-sm"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const precio = producto.price[0]?.price || 0;
  const precioEspecial = Math.round(precio * 0.85);
  const stock = producto.inventory?.availableQuantity || 0;
  const enStock = stock > 0;
  // Antes del return, calcula las imágenes ordenadas
  const imagenes = producto.images
    ? [...producto.images].sort(
        (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0),
      )
    : [];
  const imagenPrincipal = imagenes[imagenActual]?.url || null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        breadcrumb={[
          { label: "Inicio", href: "/" },
          { label: "Catálogo", href: "/catalogo" },
          { label: producto.category?.name || "General", href: "/catalogo" },
          { label: producto.name },
        ]}
      />

      <div className="max-w-8xl mx-auto px-4 md:px-6 py-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          {/* Galería */}
          {/* Galería */}
          <div className="rounded-t-lg bg-gray-100 border-gray-400 border-2">
            <div className="rounded-t-lg overflow-hidden h-72 md:h-96 flex items-center justify-center mb-3 bg-white">
              {imagenPrincipal ? (
                <img
                  src={imagenPrincipal}
                  alt={producto.name}
                  className="object-contain h-full w-full"
                />
              ) : (
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-verde/20"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              )}
            </div>

            {imagenes.length > 0 && (
              <div className="flex gap-2 items-center justify-center mb-6 flex-wrap px-2">
                {imagenes.slice(0, 5).map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setImagenActual(i)}
                    className={`w-20 h-20 md:w-28 md:h-28 border-2 bg-white flex items-center justify-center transition-colors cursor-pointer overflow-hidden ${
                      imagenActual === i ? "border-amarillo" : "border-gray-400"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${producto.name} ${i + 1}`}
                      className="object-contain w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div
            ref={infoPanelRef}
            className="bg-gray-100 border-gray-400 border-2 rounded-t-lg pt-4 px-4 md:pl-7 md:pr-7"
          >
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm text-gray-500 uppercase tracking-widest">
                {producto.reference || producto.category?.name || "—"}
              </p>
              <button
                onClick={() => setGuardado(!guardado)}
                className="flex items-center gap-1 text-sm text-amarillo-oscuro hover:text-amarillo transition-colors cursor-pointer"
              >
                Guardar en mis listas
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill={guardado ? "#e1b86b" : "none"}
                  stroke={guardado ? "#e1b86b" : "currentColor"}
                  strokeWidth="1.5"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </button>
            </div>

            <h1 className="text-lg md:text-2xl font-semibold text-verde mb-1 mt-3 pr-3">
              {producto.name}
            </h1>
            <p className="text-sm text-gray-500 mb-2">Ref: {producto.id}</p>

            <div className="flex items-center gap-2 mb-4">
              <Estrellas cantidad={5} />
              <span className="text-sm text-gray-400">5.0 (0)</span>
            </div>

            {esEspecial ? (
              <div className="mb-4">
                <p className="text-sm text-gray-400 line-through">
                  $ {Math.round(precio).toLocaleString("es-CO")} und
                </p>
                <p className="text-2xl font-medium text-amarillo">
                  $ {precioEspecial.toLocaleString("es-CO")} und
                </p>
              </div>
            ) : (
              <p className="text-xl md:text-2xl font-semibold text-verde/88 mb-4">
                $ {Math.round(precio).toLocaleString("es-CO")} und
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-9 h-9 flex items-center justify-center text-verde hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-10 text-center text-sm font-medium text-verde">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad(Math.min(stock, cantidad + 1))}
                  className="w-9 h-9 flex items-center justify-center text-verde hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    agregarItem({
                      id: Number(producto.id),
                      nombre: producto.name,
                      precio: esEspecial ? precioEspecial : Math.round(precio),
                      cantidad,
                    });
                    setMostrarModal(true);
                  }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-verde text-amarillo hover:opacity-90 cursor-pointer transition-all"
                >
                  Agregar al carro
                </button>
                <button
                  disabled={!botonDesbloqueado}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    botonDesbloqueado
                      ? "bg-verde text-amarillo hover:opacity-90 cursor-pointer"
                      : "bg-red-800 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Comprar ahora
                </button>
              </div>
            </div>

            {!botonDesbloqueado && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Lee la descripción y la ficha técnica primero, el botón de
                compra se habilitará automáticamente
              </motion.div>
            )}
          </div>
        </div>

        {/* Grid inferior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Descripción */}
          <div className="bg-gray-100 border-gray-400 border-2 overflow-hidden">
            <button
              onClick={() => setDescripcionAbierta(!descripcionAbierta)}
              className="w-full flex items-center justify-between p-4 text-xl font-semibold text-verde"
            >
              Descripción
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`transition-transform ${descripcionAbierta ? "rotate-180" : ""} mr-6 cursor-pointer`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="hidden lg:block w-xl ml-4 h-px bg-gray-400 mb-5" />
            <AnimatePresence>
              {descripcionAbierta && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    <div>
                      <p className="text-base font-semibold text-verde mb-1">
                        {producto.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {producto.description || "Sin descripción disponible"}
                      </p>
                    </div>
                    <div ref={especificacionesRef} className="h-1" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Especificaciones + Garantía + Entrega */}
          <div className="space-y-7">
            <div className="bg-gray-100 border-2 border-gray-100 p-4">
              <p className="text-sm font-semibold text-verde mb-3">
                Especificaciones principales
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-verde">
                  <span className="text-amarillo">+</span>
                  <span>Categoría:</span>
                  <span className="text-gray-600">
                    {producto.category?.name || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-verde">
                  <span className="text-amarillo">+</span>
                  <span>Referencia:</span>
                  <span className="text-gray-600">
                    {producto.reference || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-verde">
                  <span className="text-amarillo">+</span>
                  <span>Stock disponible:</span>
                  <span className="text-gray-600">{stock} unidades</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-verde">
                  <span className="text-amarillo">+</span>
                  <span>Estado:</span>
                  <span className={enStock ? "text-green-600" : "text-red-500"}>
                    {enStock ? "En stock" : "Agotado"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 border-3 border-dotted border-amarillo rounded-xl p-4 flex items-start gap-3 h-44">
              <Image
                src="/images/Insignia.png"
                alt="Insignia de garantia"
                width={50}
                height={50}
              />
              <div>
                <p className="text-sm font-semibold text-verde">
                  Satisfacción Garantizada
                </p>
                <p className="text-sm text-gray-400 mt-0.5">Garantía</p>
                <p className="text-sm text-gray-400">
                  Contáctanos para más información sobre la garantía de este
                  producto
                </p>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-100 p-4">
              <p className="text-sm font-semibold text-verde mb-3">
                Entrega en
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:border-amarillo transition-colors bg-white">
                  <div className="flex items-center gap-2">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 61 61"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.3903 48.6095C10.9077 47.1268 10.1663 45.3265 10.1663 43.2084H3.81217L4.95592 38.1251H12.1361C12.8563 37.3202 13.7035 36.6954 14.6778 36.2506C15.6521 35.8058 16.69 35.5834 17.7913 35.5834C18.8927 35.5834 19.9306 35.8058 20.9049 36.2506C21.8792 36.6954 22.7264 37.3202 23.4466 38.1251H34.058L39.3955 15.2501H11.5643L11.8184 14.1699C12.0726 12.9838 12.6551 12.02 13.5658 11.2787C14.4766 10.5374 15.5462 10.1667 16.7747 10.1667H45.7497L43.3986 20.3334H50.833L58.458 30.5001L55.9163 43.2084H50.833C50.833 45.3265 50.0917 47.1268 48.6091 48.6095C47.1264 50.0921 45.3261 50.8334 43.208 50.8334C41.09 50.8334 39.2896 50.0921 37.807 48.6095C36.3243 47.1268 35.583 45.3265 35.583 43.2084H25.4163C25.4163 45.3265 24.675 47.1268 23.1924 48.6095C21.7097 50.0921 19.9094 50.8334 17.7913 50.8334C15.6733 50.8334 13.8729 50.0921 12.3903 48.6095Z"
                        fill="#C59C4D"
                      />
                    </svg>
                    <span className="text-sm text-verde">Llega el</span>
                  </div>
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:border-amarillo transition-colors bg-white">
                  <div className="flex items-center gap-2">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 61 61"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M45.7503 58.4584V50.8334H38.1253V45.7501H45.7503V38.1251H50.8337V45.7501H58.4587V50.8334H50.8337V58.4584H45.7503ZM5.08366 50.8334V35.5834H2.54199V30.5001L5.08366 17.7917H43.2087L45.7503 30.5001V35.5834H43.2087V43.2084H38.1253V35.5834H27.9587V50.8334H5.08366ZM10.167 45.7501H22.8753V35.5834H10.167V45.7501ZM5.08366 15.2501V10.1667H43.2087V15.2501H5.08366ZM7.75241 30.5001H40.5399L39.0149 22.8751H9.27741L7.75241 30.5001Z"
                        fill="#C59C4D"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-verde block">
                        Disponibilidad en tienda
                      </span>
                      <span className="text-sm text-gray-400">
                        {stock} unidades disponibles
                      </span>
                    </div>
                  </div>
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Ficha técnica */}
          <div className="col-span-1 md:col-span-2 bg-gray-100 border-2 border-gray-400 overflow-hidden mb-10">
            <button
              onClick={() => setFichaTecnicaAbierta(!fichaTecnicaAbierta)}
              className="w-full flex items-center justify-between p-4 text-lg font-semibold text-verde"
            >
              Ficha técnica
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`transition-transform ${fichaTecnicaAbierta ? "rotate-180" : ""} mr-7 cursor-pointer`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="hidden lg:block w-xl ml-4 h-px bg-gray-400 mb-5" />
            <AnimatePresence>
              {fichaTecnicaAbierta && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="bg-gray-200">
                          <td className="py-2 px-4 text-gray-600 w-1/2">
                            Nombre
                          </td>
                          <td className="py-2 px-4 text-gray-400">
                            {producto.name}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="py-2 px-4 text-gray-600 w-1/2">
                            Referencia
                          </td>
                          <td className="py-2 px-4 text-gray-400">
                            {producto.reference || "—"}
                          </td>
                        </tr>
                        <tr className="bg-gray-200">
                          <td className="py-2 px-4 text-gray-600 w-1/2">
                            Categoría
                          </td>
                          <td className="py-2 px-4 text-gray-400">
                            {producto.category?.name || "—"}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="py-2 px-4 text-gray-600 w-1/2">
                            Stock disponible
                          </td>
                          <td className="py-2 px-4 text-gray-400">
                            {stock} unidades
                          </td>
                        </tr>
                        <tr className="bg-gray-200">
                          <td className="py-2 px-4 text-gray-600 w-1/2">
                            Precio
                          </td>
                          <td className="py-2 px-4 text-gray-400">
                            $ {Math.round(precio).toLocaleString("es-CO")}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="py-2 px-4 text-gray-600 w-1/2">
                            Estado
                          </td>
                          <td className="py-2 px-4 text-gray-400">
                            {enStock ? "En stock" : "Agotado"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Juntos es mejor */}
        <div className="mb-10">
          <h2 className="text-2xl font-medium text-verde text-center mb-6">
            ¡ Juntos es mejor !
          </h2>
          <div className="relative px-8">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4"
                animate={{ x: `-${sliderRelacionados * (100 / 4)}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {[1, 2, 3, 4, 1, 2, 3, 4].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[calc(50%-8px)] md:min-w-[calc(25%-12px)] bg-white rounded-xl border border-gray-100 overflow-hidden flex-shrink-0"
                  >
                    <div className="h-32 md:h-40 bg-gray-50 flex items-center justify-center">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        className="text-verde/20"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-400 leading-tight">
                        Producto relacionado
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            <button
              onClick={() =>
                setSliderRelacionados((prev) => Math.max(0, prev - 1))
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-amarillo transition-colors z-10 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 69 69" fill="none">
                <path
                  d="M28.75 63.25L0 34.5L28.75 5.75002L33.8531 10.8531L10.2063 34.5L33.8531 58.1469L28.75 63.25Z"
                  fill="#112221"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setSliderRelacionados((prev) => Math.min(3, prev + 1))
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-amarillo transition-colors z-10 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 69 69" fill="none">
                <path
                  d="M40.25 5.75L69 34.5L40.25 63.25L35.1469 58.1469L58.7938 34.5L35.1469 10.8531L40.25 5.75Z"
                  fill="#112221"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Reseñas */}
      <div className="w-full bg-gray-100 border-t border-b border-gray-200 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-base font-semibold text-verde mb-1">Reseñas</h2>
          <div className="flex flex-col md:flex-row gap-8 mt-4">
            <div className="min-w-[220px]">
              <p className="text-xs text-gray-500 mb-1">
                Muestra de puntuacion
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Seleccionar una fila para filtrar reseñas.
              </p>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16">
                      {i} estrellas
                    </span>
                    <div className="flex-1 h-1 bg-gray-300 rounded-full">
                      <div className="h-full bg-amarillo rounded-full w-0" />
                    </div>
                    <span className="text-xs text-gray-400 w-3">0</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block w-px bg-gray-200 self-stretch" />
            <div className="flex flex-col items-start">
              <p className="text-xs text-gray-500 mb-2">
                Clasificación general
              </p>
              <div className="flex items-center gap-3">
                <p className="text-6xl font-light text-verde">0</p>
                <Estrellas cantidad={0} size="lg" />
              </div>
              <p className="text-xs text-gray-400 mt-2">0 reseñas</p>
              <p className="text-xs text-gray-400">
                0 de 0 clientes recomiendan este producto
              </p>
            </div>
            <div className="md:ml-auto flex items-start">
              <button className="px-4 py-2.5 border border-amarillo text-verde text-sm rounded-lg hover:bg-amarillo hover:text-hueso transition-colors cursor-pointer">
                Calificar este producto
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Botón flotante */}
      <AnimatePresence>
        {mostrarFlotante && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3"
          >
            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-verde hover:border-amarillo transition-colors cursor-pointer"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span className="text-sm font-medium text-verde w-6 text-center">
                {cantidad}
              </span>
              <button
                onClick={() => setCantidad(Math.min(stock, cantidad + 1))}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-verde hover:border-amarillo transition-colors cursor-pointer"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => {
                agregarItem({
                  id: Number(producto.id),
                  nombre: producto.name,
                  precio: esEspecial ? precioEspecial : Math.round(precio),
                  cantidad,
                });
                setMostrarModal(true);
              }}
              className="px-4 py-2 bg-verde text-amarillo text-sm font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Agregar al carro
            </button>
            <button
              disabled={!botonDesbloqueado}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-opacity ${
                botonDesbloqueado
                  ? "bg-amarillo text-verde hover:opacity-90 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Comprar ahora
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalCarrito
        visible={mostrarModal}
        onCerrar={() => setMostrarModal(false)}
      />
    </div>
  );
}
