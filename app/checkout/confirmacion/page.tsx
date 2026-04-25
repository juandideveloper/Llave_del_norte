"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { motion } from "framer-motion";

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const boldStatus = searchParams.get("bold-status") || searchParams.get("status") || "";
  const orderId = searchParams.get("bold-order-id") || searchParams.get("order-id") || "";
  const rechazado = boldStatus === "rejected" || boldStatus === "REJECTED";
  const [melonnEstado, setMelonnEstado] = useState<"pendiente" | "creado" | "error">("pendiente")

  useEffect(() => {
    if (rechazado) return

    // Limpiar carrito
    localStorage.removeItem("carrito")

    // Crear orden en Melonn
    const datosCheckout = localStorage.getItem("checkout_datos")
    const datosCarrito = localStorage.getItem("checkout_items")

    if (datosCheckout && datosCarrito && orderId) {
      const datos = JSON.parse(datosCheckout)
      const items = JSON.parse(datosCarrito)

      fetch("/api/melonn/crear-orden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          items,
          cliente: {
            nombre: `${datos.nombre} ${datos.apellido}`,
            telefono: datos.telefono,
            email: datos.correo,
          },
          direccion: {
            direccion: datos.direccion,
            ciudad: datos.ciudad,
            region: datos.departamento,
          },
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setMelonnEstado("creado")
        else setMelonnEstado("error")
      })
      .catch(() => setMelonnEstado("error"))
      .finally(() => {
        localStorage.removeItem("checkout_datos")
        localStorage.removeItem("checkout_items")
      })
    } else {
      localStorage.removeItem("checkout_datos")
      localStorage.removeItem("checkout_items")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (rechazado) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-20 h-20 rounded-full border-2 border-red-400 flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </motion.div>
        <h1 className="text-2xl font-semibold text-red-500 mb-2">Pago rechazado</h1>
        <p className="text-sm text-amarillo mb-8 text-center max-w-sm">
          Tu pago no pudo ser procesado. Por favor intenta de nuevo.
        </p>
        <Link href="/checkout"
          className="w-64 py-3 bg-verde text-amarillo text-sm font-medium text-center rounded-lg hover:opacity-90 transition-opacity mb-4">
          Intentar de nuevo
        </Link>
        <Link href="/"
          className="w-64 py-3 border border-verde text-verde text-sm font-medium text-center rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-25 h-25 rounded-full border-3 border-verde flex items-center justify-center mb-6">
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#112221" strokeWidth="1.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </motion.div>

      <h1 className="text-2xl font-semibold text-amarillo-oscuro mb-2">¡Pago exitoso!</h1>
      <p className="text-md font-semibold text-amarillo-oscuro mb-4 text-center max-w-md">
        Te enviamos un correo con los detalles de tu compra
      </p>

      <div className="text-amarillo px-8 py-3 rounded-lg text-2xl font-semibold mb-4">
        Pedido: #{orderId || "Procesado"}
      </div>

      {/* Estado envío Melonn */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs mb-6 ${
        melonnEstado === "creado" ? "bg-green-50 text-green-700" :
        melonnEstado === "error" ? "bg-red-50 text-red-600" :
        "bg-gray-50 text-gray-400"
      }`}>
        {melonnEstado === "pendiente" && (
          <>
            <div className="w-3 h-3 rounded-full border border-gray-400 border-t-transparent animate-spin"/>
            Preparando tu envío...
          </>
        )}
        {melonnEstado === "creado" && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Orden de envío creada con Melonn
          </>
        )}
        {melonnEstado === "error" && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01"/>
            </svg>
            El equipo procesará tu envío manualmente
          </>
        )}
      </div>

      <Link href="/perfil/pedidos"
        className="w-64 py-3 bg-verde text-amarillo text-sm font-medium text-center rounded-lg hover:opacity-90 transition-opacity mb-4">
        Ver mis pedidos
      </Link>
      <Link href="/catalogo"
        className="w-64 py-3 border border-verde text-verde text-sm font-medium text-center rounded-lg hover:bg-verde hover:text-amarillo transition-colors mb-8">
        Seguir comprando
      </Link>

      <div className="text-center">
        <p className="text-xs text-gray-400 mb-3">no olvides de seguirnos en redes sociales</p>
        <div className="flex items-center justify-center gap-4">
          <a href="https://www.instagram.com/lallavedelnorte/" target="_blank" rel="noopener noreferrer"
            className="text-verde hover:text-amarillo transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@lallavedelnorte1" target="_blank" rel="noopener noreferrer"
            className="text-verde hover:text-amarillo transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
            </svg>
          </a>
          <a href="https://wa.me/573134866451" target="_blank" rel="noopener noreferrer"
            className="text-verde hover:text-amarillo transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar breadcrumb={[
        { label: "Inicio", href: "/" },
        { label: "Checkout", href: "/checkout" },
        { label: "Confirmación" },
      ]}/>
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-verde border-t-transparent animate-spin"/>
        </div>
      }>
        <ConfirmacionContent/>
      </Suspense>
    </div>
  )
}