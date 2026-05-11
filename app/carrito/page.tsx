"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useCarrito } from "@/context/CarritoContext";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const tienda = {
  nombre: "La llave del norte Chapinero",
  direccion: "CALLE 65 #14-20 Bogotá D.C.",
  horario: "Abierto de 7:30 AM a 6:30 PM.",
  disponible: true,
  tiempoEstimado: "Tiempo estimado",
};

const metodosPago = [
  { id: 1, nombre: "Codensa", img: "/images/TarjetaCodensa.png" },
  { id: 2, nombre: "PSE", img: "/images/Pse.png" },
  { id: 3, nombre: "Nequi", img: "/images/Nequi.png" },
  { id: 4, nombre: "Daviplata", img: "/images/Daviplata.png" },
  { id: 5, nombre: "Mastercard", img: "/images/Mastercard.png" },
  { id: 6, nombre: "Visa", img: "/images/Visa.png" },
  { id: 7, nombre: "Bold", img: "/images/Bold.png" },
];

function SkeletonCarrito() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl border-2 border-gray-200 p-4"
            >
              <div className="flex gap-4">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 rounded-xl border-2 border-gray-200 p-5 h-64" />
      </div>
    </div>
  );
}

export default function CarritoPage() {
  const {
    items,
    eliminarItem,
    actualizarCantidad,
    totalItems,
    totalPrecio,
    hidratado,
    metodoEnvio,
    setMetodoEnvio,
  } = useCarrito();
  const { data: session } = useSession();

  const [modalTienda, setModalTienda] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(false);
  const [ciudad, setCiudad] = useState("Bogotá D.C");
  const [sliderPago, setSliderPago] = useState(0);

  const esEspecial =
    session?.user?.role === "ESPECIAL" && session?.user?.estado === "APROBADO";

  // totalPrecio ya tiene el descuento aplicado
  // subtotalOriginal es el precio sin descuento
  const subtotalOriginal = items.reduce((acc, item) => {
    const original = item.precioOriginal || item.precio;
    return acc + original * item.cantidad;
  }, 0);
  const ahorroTotal = subtotalOriginal - (totalPrecio as number);
  const costoEnvio = 0;
  const totalFinal = (totalPrecio as number) + costoEnvio;

  if (!hidratado)
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          breadcrumb={[
            { label: "Inicio", href: "/" },
            { label: "Mi carrito de compras" },
          ]}
        />
        <SkeletonCarrito />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        breadcrumb={[
          { label: "Inicio", href: "/" },
          { label: "Mi carrito de compras" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl font-medium text-verde mb-6">
          Productos en el carrito: ({totalItems})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-300 mx-auto mb-4"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <p className="text-gray-400 text-sm mb-4">Tu carrito está vacío</p>
            <Link
              href="/catalogo"
              className="px-6 py-2.5 bg-verde text-amarillo text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const precioOriginal = item.precioOriginal || item.precio;
                const ahorroItem = Math.round(
                  (precioOriginal - item.precio) * item.cantidad,
                );
                return (
                  <div
                    key={item.id}
                    className="bg-gray-100 rounded-t-xl border-2 border-gray-400 p-4"
                  >
                    <div className="flex gap-4">
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {item.imagen ? (
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="object-contain w-full h-full p-2"
                          />
                        ) : (
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
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-verde mb-2 leading-tight">
                          {item.nombre}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap mt-4">
                          <p className="text-xs text-gray-500">Cantidad</p>
                          <div className="flex items-center gap-1 border border-gray-400 rounded-md overflow-hidden">
                            <button
                              onClick={() =>
                                actualizarCantidad(
                                  item.id,
                                  Math.max(1, item.cantidad - 1),
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-verde hover:bg-gray-200 transition-colors cursor-pointer"
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
                            <input
                              type="text"
                              value={item.cantidad}
                              onChange={(e) => {
                                const val = parseInt(
                                  e.target.value.replace(/[^0-9]/g, ""),
                                );
                                if (!isNaN(val) && val >= 1)
                                  actualizarCantidad(item.id, val);
                              }}
                              className="w-10 text-center text-xs text-verde outline-none bg-transparent border-x border-gray-400 py-1"
                            />
                            <button
                              onClick={() =>
                                actualizarCantidad(item.id, item.cantidad + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-verde hover:bg-gray-200 transition-colors cursor-pointer"
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
                            onClick={() => eliminarItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {esEspecial && item.precioOriginal ? (
                          <>
                            <p className="text-xs text-gray-400 line-through">
                              ${" "}
                              {(precioOriginal * item.cantidad).toLocaleString(
                                "es-CO",
                              )}
                            </p>
                            <p className="text-sm font-medium text-verde">
                              ${" "}
                              {(item.precio * item.cantidad).toLocaleString(
                                "es-CO",
                              )}
                            </p>
                            {ahorroItem > 0 && (
                              <p className="text-xs text-green-600 mt-0.5">
                                Ahorras $ {ahorroItem.toLocaleString("es-CO")}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm font-medium text-verde">
                            ${" "}
                            {(item.precio * item.cantidad).toLocaleString(
                              "es-CO",
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Método de envío */}
              <div className="bg-gray-100 rounded-b-xl border-2 border-gray-400 p-4">
                <p className="text-sm font-medium text-verde mb-3">
                  Método de envío
                </p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="envio"
                      checked={metodoEnvio === "envio"}
                      onChange={() => {
                        setMetodoEnvio("envio");
                        setTiendaSeleccionada(false);
                      }}
                      className="accent-verde cursor-pointer"
                    />
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 61 61"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.3903 48.6095C10.9077 47.1268 10.1663 45.3265 10.1663 43.2084H3.81217L4.95592 38.1251H12.1361C12.8563 37.3202 13.7035 36.6954 14.6778 36.2506C15.6521 35.8058 16.69 35.5834 17.7913 35.5834C18.8927 35.5834 19.9306 35.8058 20.9049 36.2506C21.8792 36.6954 22.7264 37.3202 23.4466 38.1251H34.058L39.3955 15.2501H11.5643L11.8184 14.1699C12.0726 12.9838 12.6551 12.02 13.5658 11.2787C14.4766 10.5374 15.5462 10.1667 16.7747 10.1667H45.7497L43.3986 20.3334H50.833L58.458 30.5001L55.9163 43.2084H50.833C50.833 45.3265 50.0917 47.1268 48.6091 48.6095C47.1264 50.0921 45.3261 50.8334 43.208 50.8334C41.09 50.8334 39.2896 50.0921 37.807 48.6095C36.3243 47.1268 35.583 45.3265 35.583 43.2084H25.4163C25.4163 45.3265 24.675 47.1268 23.1924 48.6095C21.7097 50.0921 19.9094 50.8334 17.7913 50.8334C15.6733 50.8334 13.8729 50.0921 12.3903 48.6095Z"
                        fill="#C59C4D"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-verde">Envío</span>
                      <span className="text-sm text-amarillo font-medium ml-2">
                        Gratis en Bogotá · $15.000 otras ciudades
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="envio"
                      checked={metodoEnvio === "tienda"}
                      onChange={() => {
                        setMetodoEnvio("tienda");
                        setModalTienda(true);
                      }}
                      className="accent-verde cursor-pointer"
                    />
                    <svg width="28" height="28" viewBox="0 0 61 61" fill="none">
                      <path
                        d="M45.7503 58.4584V50.8334H38.1253V45.7501H45.7503V38.1251H50.8337V45.7501H58.4587V50.8334H50.8337V58.4584H45.7503ZM5.08366 50.8334V35.5834H2.54199V30.5001L5.08366 17.7917H43.2087L45.7503 30.5001V35.5834H43.2087V43.2084H38.1253V35.5834H27.9587V50.8334H5.08366ZM10.167 45.7501H22.8753V35.5834H10.167V45.7501ZM5.08366 15.2501V10.1667H43.2087V15.2501H5.08366ZM7.75241 30.5001H40.5399L39.0149 22.8751H9.27741L7.75241 30.5001Z"
                        fill="#C59C4D"
                      />
                    </svg>
                    <div>
                      <span className="text-sm text-verde">
                        Recoger en la tienda
                      </span>
                      <span className="text-sm text-verde font-medium ml-2">
                        gratis
                      </span>
                    </div>
                  </label>
                  {metodoEnvio === "tienda" && tiendaSeleccionada && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="ml-8 p-3 bg-verde rounded-lg border border-amarillo/30"
                    >
                      <p className="text-xs font-medium text-hueso">
                        {tienda.nombre}
                      </p>
                      <p className="text-xs text-gray-300">
                        {tienda.direccion}
                      </p>
                      <p className="text-xs text-gray-300">{tienda.horario}</p>
                      <button
                        onClick={() => setModalTienda(true)}
                        className="text-xs text-amarillo mt-1 hover:underline cursor-pointer"
                      >
                        Cambiar tienda
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha — Resumen */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-xl border-2 border-gray-400 p-5">
                <p className="text-sm font-medium text-verde mb-4">
                  Mi carrito
                </p>
                <div className="space-y-3 mb-4">
                  {esEspecial && ahorroTotal > 0 ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Precio original</span>
                        <span className="text-gray-400 line-through">
                          $ {subtotalOriginal.toLocaleString("es-CO")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Subtotal con descuento
                        </span>
                        <span className="text-verde font-medium">
                          $ {(totalPrecio as number).toLocaleString("es-CO")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Descuento mayorista
                        </span>
                        <span className="text-green-600 font-medium">
                          - $ {ahorroTotal.toLocaleString("es-CO")}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal ({totalItems} producto
                        {totalItems !== 1 ? "s" : ""})
                      </span>
                      <span className="text-verde font-medium">
                        $ {(totalPrecio as number).toLocaleString("es-CO")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Entrega</span>
                    <span className="text-amarillo font-medium">
                      {metodoEnvio === "tienda"
                        ? "Gratis"
                        : "Se calcula en checkout"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-verde">
                      Total a pagar
                    </span>
                    <span className="text-base font-bold text-verde">
                      $ {totalFinal.toLocaleString("es-CO")}
                    </span>
                  </div>
                  {esEspecial && ahorroTotal > 0 && (
                    <p className="text-xs text-green-600 text-right mt-1">
                      Precio mayorista aplicado ✓
                    </p>
                  )}
                </div>
                <Link
                  href="/checkout"
                  className="block w-full py-3 bg-verde text-amarillo text-sm font-medium text-center rounded-lg hover:opacity-90 transition-opacity"
                >
                  Ir a pagar
                </Link>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Recibimos todos los medios de pago y también efectivo.
                </p>

                {/* Slider métodos de pago */}
                <div className="mt-4">
                  <div className="overflow-hidden">
                    <motion.div
                      className="flex gap-2 items-center"
                      animate={{ x: `-${sliderPago * 56}px` }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      {[...metodosPago, ...metodosPago].map((metodo, i) => (
                        <div
                          key={i}
                          className="rounded border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden"
                        >
                          <Image
                            src={metodo.img}
                            alt={metodo.nombre}
                            width={60}
                            height={50}
                            className="object-contain w-full h-full p-1"
                          />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                  <div className="flex justify-end mt-2 gap-1">
                    <button
                      onClick={() =>
                        setSliderPago((prev) =>
                          prev >= metodosPago.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="w-6 h-6 text-3xl flex items-center justify-center text-gray-700 hover:text-amarillo cursor-pointer"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal selección de tienda */}
      <AnimatePresence>
        {modalTienda && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => {
                setModalTienda(false);
                if (!tiendaSeleccionada) setMetodoEnvio("envio");
              }}
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6 mr-2">
                  <div className="flex items-center gap-3">
                    <svg width="32" height="32" viewBox="0 0 61 61" fill="none">
                      <path
                        d="M45.7503 58.4584V50.8334H38.1253V45.7501H45.7503V38.1251H50.8337V45.7501H58.4587V50.8334H50.8337V58.4584H45.7503ZM5.08366 50.8334V35.5834H2.54199V30.5001L5.08366 17.7917H43.2087L45.7503 30.5001V35.5834H43.2087V43.2084H38.1253V35.5834H27.9587V50.8334H5.08366ZM10.167 45.7501H22.8753V35.5834H10.167V45.7501ZM5.08366 15.2501V10.1667H43.2087V15.2501H5.08366ZM7.75241 30.5001H40.5399L39.0149 22.8751H9.27741L7.75241 30.5001Z"
                        fill="#C59C4D"
                      />
                    </svg>
                    <p className="text-sm font-medium text-verde leading-tight">
                      Selecciona una tienda o punto aliado para recoger tu
                      producto
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setModalTienda(false);
                      if (!tiendaSeleccionada) setMetodoEnvio("envio");
                    }}
                    className="w-8 h-8 rounded-full border border-amarillo-oscuro flex items-center justify-center text-amarillo-oscuro hover:text-amarillo hover:border-amarillo cursor-pointer flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
                <div className="w-full h-px bg-gray-100 mb-6" />
                <p className="text-sm text-verde mb-2">
                  Por favor, selecciona tu ciudad:
                </p>
                <p className="text-xs text-gray-400 mb-2">Ciudad</p>
                <div className="relative mb-6">
                  <select
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="w-full border border-gray-200 rounded-t-lg px-3 py-2.5 text-sm text-verde outline-none appearance-none cursor-pointer"
                  >
                    <option>Selecciona tu ciudad</option>
                    <option>Bogotá D.C</option>
                  </select>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                <div
                  className={`border rounded-xl p-4 cursor-pointer transition-colors ${tiendaSeleccionada ? "border-amarillo bg-verde" : "border-gray-100 hover:border-amarillo"}`}
                  onClick={() => {
                    setTiendaSeleccionada(true);
                    setModalTienda(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${tiendaSeleccionada ? "border-amarillo bg-amarillo" : "border-gray-300"}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-amarillo">
                          {tienda.nombre}
                        </p>
                        <a
                          href="https://maps.app.goo.gl/93JBZoNtCp5drGMU9"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-1 items-center text-xs text-amarillo hover:underline"
                        >
                          Mapa
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 38 38"
                            fill="none"
                          >
                            <path
                              d="M7.91667 33.25C7.04583 33.25 6.30035 32.9399 5.68021 32.3198C5.06007 31.6997 4.75 30.9542 4.75 30.0833V7.91667C4.75 7.04583 5.06007 6.30035 5.68021 5.68021C6.30035 5.06007 7.04583 4.75 7.91667 4.75H19V7.91667H7.91667V30.0833H30.0833V19H33.25V30.0833C33.25 30.9542 32.9399 31.6997 32.3198 32.3198C31.6997 32.9399 30.9542 33.25 30.0833 33.25H7.91667ZM15.3583 24.8583L13.1417 22.6417L27.8667 7.91667H22.1667V4.75H33.25V15.8333H30.0833V10.1333L15.3583 24.8583Z"
                              fill="#c58e28ea"
                            />
                          </svg>
                        </a>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        {tienda.direccion}
                      </p>
                      <p className="text-xs text-gray-300">{tienda.horario}</p>
                      <p className="text-xs text-verde mt-1">
                        Disponible para recoger
                      </p>
                      <p className="text-xs text-amarillo mt-0.5">
                        {tienda.tiempoEstimado}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
