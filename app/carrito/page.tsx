"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useCarrito } from "@/context/CarritoContext";
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

  const [modalTienda, setModalTienda] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(false);
  const [ciudad, setCiudad] = useState("Bogotá D.C");
  const [sliderPago, setSliderPago] = useState(0);

  const costoEnvio: number = 0;
  const totalFinal: number = (totalPrecio as number) + costoEnvio;

  if (!hidratado)
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          breadcrumb={[
            { label: "Inicio", href: "/" },
            { label: "Mi carrito de compras" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-verde border-t-transparent animate-spin" />
        </div>
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
            {/* Columna izquierda — Productos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-100 rounded-t-xl border-2 border-gray-400 p-4"
                >
                  <div className="flex gap-4">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
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
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-1">Codigo:</p>
                      <p className="text-sm font-medium text-verde mb-2 leading-tight">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        Tamaño: 60x45 Cm
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        Material: Acero Inoxidable
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        Color: Plateado
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-xs text-gray-500">Cantidad</p>
                        <select
                          value={item.cantidad}
                          onChange={(e) =>
                            actualizarCantidad(item.id, Number(e.target.value))
                          }
                          className="border border-gray-400 rounded-md text-xs text-verde px-2 py-1 outline-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
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
                      <p className="text-sm font-medium text-verde">
                        ${(item.precio * item.cantidad).toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

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
                      <g>
                        <path
                          d="M12.3903 48.6095C10.9077 47.1268 10.1663 45.3265 10.1663 43.2084H3.81217L4.95592 38.1251H12.1361C12.8563 37.3202 13.7035 36.6954 14.6778 36.2506C15.6521 35.8058 16.69 35.5834 17.7913 35.5834C18.8927 35.5834 19.9306 35.8058 20.9049 36.2506C21.8792 36.6954 22.7264 37.3202 23.4466 38.1251H34.058L39.3955 15.2501H11.5643L11.8184 14.1699C12.0726 12.9838 12.6551 12.02 13.5658 11.2787C14.4766 10.5374 15.5462 10.1667 16.7747 10.1667H45.7497L43.3986 20.3334H50.833L58.458 30.5001L55.9163 43.2084H50.833C50.833 45.3265 50.0917 47.1268 48.6091 48.6095C47.1264 50.0921 45.3261 50.8334 43.208 50.8334C41.09 50.8334 39.2896 50.0921 37.807 48.6095C36.3243 47.1268 35.583 45.3265 35.583 43.2084H25.4163C25.4163 45.3265 24.675 47.1268 23.1924 48.6095C21.7097 50.0921 19.9094 50.8334 17.7913 50.8334C15.6733 50.8334 13.8729 50.0921 12.3903 48.6095ZM40.4757 33.0417H52.7393L52.9934 31.7074L48.2913 25.4167H42.2549L40.4757 33.0417ZM39.2684 15.6949L39.3955 15.2501L34.058 38.1251L34.1851 37.6803L36.3455 28.4032L39.2684 15.6949ZM1.27051 33.8678L2.54134 28.7845H16.5205L15.2497 33.8678H1.27051ZM6.35384 24.5907L7.62467 19.5074H24.1455L22.8747 24.5907H6.35384ZM17.7913 45.7501C18.5115 45.7501 19.1151 45.5065 19.6023 45.0194C20.0894 44.5322 20.333 43.9286 20.333 43.2084C20.333 42.4883 20.0894 41.8846 19.6023 41.3975C19.1151 40.9103 18.5115 40.6667 17.7913 40.6667C17.0712 40.6667 16.4676 40.9103 15.9804 41.3975C15.4933 41.8846 15.2497 42.4883 15.2497 43.2084C15.2497 43.9286 15.4933 44.5322 15.9804 45.0194C16.4676 45.5065 17.0712 45.7501 17.7913 45.7501ZM43.208 45.7501C43.9281 45.7501 44.5318 45.5065 45.0189 45.0194C45.5061 44.5322 45.7497 43.9286 45.7497 43.2084C45.7497 42.4883 45.5061 41.8846 45.0189 41.3975C44.5318 40.9103 43.9281 40.6667 43.208 40.6667C42.4879 40.6667 41.8842 40.9103 41.3971 41.3975C40.9099 41.8846 40.6663 42.4883 40.6663 43.2084C40.6663 43.9286 40.9099 44.5322 41.3971 45.0194C41.8842 45.5065 42.4879 45.7501 43.208 45.7501Z"
                          fill="#C59C4D"
                        />
                      </g>
                    </svg>
                    <div>
                      <span className="text-sm text-verde">Envío</span>
                      <span className="text-sm text-amarillo font-medium ml-2">
                        gratis (o precio)
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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal ({totalItems} producto
                      {totalItems !== 1 ? "s" : ""})
                    </span>
                    <span className="text-verde font-medium">
                      $ {(totalPrecio as number).toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Entrega</span>
                    <span className="text-amarillo font-medium">
                      {costoEnvio === 0
                        ? "Gratis (o precio)"
                        : `$ ${costoEnvio.toLocaleString("es-CO")}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Descuentos</span>
                    <span className="text-verde">$ 0</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-verde">
                      Total a pagar
                    </span>
                    <span className="text-base font-bold text-verde">
                      $ {(totalFinal as number).toLocaleString("es-CO")}
                    </span>
                  </div>
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
                    <option className="bg-verde text-amarillo">
                      Selecciona tu ciudad
                    </option>
                    <option className="bg-verde text-amarillo">
                      Bogotá D.C
                    </option>
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
                  className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                    tiendaSeleccionada
                      ? "border-amarillo bg-verde"
                      : "border-gray-100 hover:border-amarillo"
                  }`}
                  onClick={() => {
                    setTiendaSeleccionada(true);
                    setModalTienda(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                        tiendaSeleccionada
                          ? "border-amarillo bg-amarillo"
                          : "border-gray-300"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-amarillo">
                          {tienda.nombre}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-amarillo cursor-pointer hover:underline">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g>
                              <path
                                d="M7.0354 19.399C6.01179 18.8872 5.49998 18.2264 5.49998 17.4167C5.49998 17.05 5.61074 16.7101 5.83227 16.3969C6.0538 16.0837 6.36317 15.8125 6.7604 15.5833L8.20415 16.9354C8.06665 16.9965 7.91769 17.0653 7.75727 17.1417C7.59685 17.2181 7.47081 17.3097 7.37915 17.4167C7.57776 17.6611 8.03609 17.875 8.75415 18.0583C9.4722 18.2417 10.2208 18.3333 11 18.3333C11.7791 18.3333 12.5316 18.2417 13.2573 18.0583C13.983 17.875 14.4451 17.6611 14.6437 17.4167C14.5368 17.2944 14.3993 17.1951 14.2312 17.1187C14.0632 17.0424 13.9028 16.9736 13.75 16.9125L15.1708 15.5375C15.5986 15.7819 15.9271 16.0608 16.1562 16.374C16.3854 16.6872 16.5 17.0347 16.5 17.4167C16.5 18.2264 15.9882 18.8872 14.9646 19.399C13.941 19.9108 12.6194 20.1667 11 20.1667C9.38054 20.1667 8.05901 19.9108 7.0354 19.399ZM11.0229 15.125C12.5354 14.0097 13.6736 12.8906 14.4375 11.7677C15.2014 10.6448 15.5833 9.51805 15.5833 8.3875C15.5833 6.82917 15.0868 5.65278 14.0937 4.85833C13.1007 4.06389 12.0694 3.66667 11 3.66667C9.93054 3.66667 8.89929 4.06389 7.90623 4.85833C6.91317 5.65278 6.41665 6.82917 6.41665 8.3875C6.41665 9.41111 6.79095 10.4767 7.53956 11.5844C8.28817 12.692 9.44929 13.8722 11.0229 15.125ZM11 17.4167C8.84581 15.8278 7.23783 14.2847 6.17602 12.7875C5.11422 11.2903 4.58331 9.82361 4.58331 8.3875C4.58331 7.30278 4.7781 6.35173 5.16769 5.53437C5.55727 4.71701 6.05762 4.03333 6.66873 3.48333C7.27984 2.93333 7.96734 2.52083 8.73123 2.24583C9.49512 1.97083 10.2514 1.83333 11 1.83333C11.7486 1.83333 12.5048 1.97083 13.2687 2.24583C14.0326 2.52083 14.7201 2.93333 15.3312 3.48333C15.9423 4.03333 16.4427 4.71701 16.8323 5.53437C17.2219 6.35173 17.4166 7.30278 17.4166 8.3875C17.4166 9.82361 16.8857 11.2903 15.8239 12.7875C14.7621 14.2847 13.1541 15.8278 11 17.4167ZM11 10.0833C11.5041 10.0833 11.9357 9.90382 12.2948 9.54479C12.6538 9.18576 12.8333 8.75417 12.8333 8.25C12.8333 7.74583 12.6538 7.31423 12.2948 6.95521C11.9357 6.59618 11.5041 6.41667 11 6.41667C10.4958 6.41667 10.0642 6.59618 9.70519 6.95521C9.34616 7.31423 9.16665 7.74583 9.16665 8.25C9.16665 8.75417 9.34616 9.18576 9.70519 9.54479C10.0642 9.90382 10.4958 10.0833 11 10.0833Z"
                                fill="#C59C4D"
                              />
                            </g>
                          </svg>
                          <a
                            href="https://maps.app.goo.gl/93JBZoNtCp5drGMU9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-2 text-sm"
                          >
                            Mapa
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 38 38"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g>
                                <path
                                  d="M7.91667 33.25C7.04583 33.25 6.30035 32.9399 5.68021 32.3198C5.06007 31.6997 4.75 30.9542 4.75 30.0833V7.91667C4.75 7.04583 5.06007 6.30035 5.68021 5.68021C6.30035 5.06007 7.04583 4.75 7.91667 4.75H19V7.91667H7.91667V30.0833H30.0833V19H33.25V30.0833C33.25 30.9542 32.9399 31.6997 32.3198 32.3198C31.6997 32.9399 30.9542 33.25 30.0833 33.25H7.91667ZM15.3583 24.8583L13.1417 22.6417L27.8667 7.91667H22.1667V4.75H33.25V15.8333H30.0833V10.1333L15.3583 24.8583Z"
                                  fill="#c58e28ea"
                                />
                              </g>
                            </svg>
                          </a>
                        </div>
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
