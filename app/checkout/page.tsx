"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useCarrito } from "@/context/CarritoContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const pasos = ["Información", "Terminos y condiciones", "Confirmar y pagar"];

interface BoldCheckoutInstance {
  open: () => void
}

interface WindowWithBold extends Window {
  BoldCheckout: new (config: object) => BoldCheckoutInstance
  __boldCheckout?: BoldCheckoutInstance
}

interface Departamento {
  id: number
  name: string
}

interface Ciudad {
  id: number
  name: string
}

function ResumenPedido({
  items,
  totalPrecio,
}: {
  items: { id: number; nombre: string; precio: number; cantidad: number }[];
  totalPrecio: number;
}) {
  return (
    <div className="bg-gray-100 rounded-xl border border-gray-400 p-5 sticky top-24">
      <p className="text-sm font-semibold text-verde mb-4">Tu pedido</p>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="0.8" className="text-verde/20">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-verde leading-tight">{item.nombre}</p>
              <p className="text-xs text-gray-400 mt-1">Cantidad: {item.cantidad}</p>
            </div>
            <p className="text-xs font-medium text-verde">
              $ {(item.precio * item.cantidad).toLocaleString("es-CO")}
            </p>
          </div>
        ))}
      </div>
      <div className="hidden lg:block h-px bg-gray-400 mb-2 mt-4"/>
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-700">Subtotal</span>
          <span className="text-verde font-medium">$ {(totalPrecio as number).toLocaleString("es-CO")}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-700">Envío</span>
          <span className="text-amarillo font-medium">Gratis</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-700">Descuentos</span>
          <span className="text-verde">$ 0</span>
        </div>
        <div className="hidden lg:block h-px bg-gray-400 mt-2"/>
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
          <span className="text-verde">Total</span>
          <span className="text-verde">$ {(totalPrecio as number).toLocaleString("es-CO")}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">Pago 100% seguro</p>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrecio, vaciarCarrito, metodoEnvio } = useCarrito();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [pasoActual, setPasoActual] = useState(0);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [numeroPedido] = useState(
    () => `#LLN-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`
  );
  const [orderId] = useState(() => `LLN-${Date.now()}`)
  const [boldIntegrity, setBoldIntegrity] = useState("")

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tipoDoc, setTipoDoc] = useState("C.C");
  const [numeroDoc, setNumeroDoc] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [departamento, setDepartamento] = useState("Selecciona tu departamento");
  const [departamentoId, setDepartamentoId] = useState<number | null>(null);
  const [ciudad, setCiudad] = useState("Selecciona tu ciudad");
  const [barrio, setBarrio] = useState("");
  const [direccion, setDireccion] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState("");
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [cargandoCiudades, setCargandoCiudades] = useState(false);

  // Redirigir al login si no está logueado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout")
    }
  }, [status, router])

  // Prellenar datos con la sesión
  useEffect(() => {
    if (session?.user) {
      const nombreCompleto = session.user.name || ""
      const partes = nombreCompleto.split(" ")
      setNombre(partes[0] || "")
      setApellido(partes.slice(1).join(" ") || "")
      setCorreo(session.user.email || "")
    }
  }, [session])

  // Cargar departamentos
  useEffect(() => {
    fetch("/api/colombia")
      .then(res => res.json())
      .then(data => setDepartamentos(data.sort((a: Departamento, b: Departamento) => a.name.localeCompare(b.name))))
      .catch(() => {})
  }, [])

  // Cargar ciudades
  const cargarCiudades = useCallback(async (id: number) => {
    setCargandoCiudades(true)
    try {
      const res = await fetch(`/api/colombia/${id}`)
      const data = await res.json()
      setCiudades(data.sort((a: Ciudad, b: Ciudad) => a.name.localeCompare(b.name)))
    } catch {
      setCiudades([])
    } finally {
      setCargandoCiudades(false)
    }
  }, [])

  useEffect(() => {
    if (departamentoId) cargarCiudades(departamentoId)
  }, [departamentoId, cargarCiudades])

  // Cargar integrity de Bold
  useEffect(() => {
    if (pasoActual === 2) {
      fetch("/api/bold/integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount: totalPrecio })
      })
        .then(res => res.json())
        .then(data => { if (data.hash) setBoldIntegrity(data.hash) })
    }
  }, [pasoActual, orderId, totalPrecio])

  // Cargar script Bold
  useEffect(() => {
    if (boldIntegrity && pasoActual === 2) {
      const scriptExistente = document.querySelector('script[src*="boldPaymentButton"]')
      if (scriptExistente) scriptExistente.remove()

      const script = document.createElement("script")
      script.src = "https://checkout.bold.co/library/boldPaymentButton.js"

      script.onload = () => {
        const boldWindow = window as unknown as WindowWithBold
        const checkout = new boldWindow.BoldCheckout({
          orderId,
          currency: "COP",
          amount: String(Math.round(totalPrecio as number)),
          apiKey: process.env.NEXT_PUBLIC_BOLD_API_KEY,
          integritySignature: boldIntegrity,
          description: "Compra en La Llave del Norte",
          redirectionUrl: `${window.location.origin}/checkout/confirmacion`,
          customerData: JSON.stringify({
            email: correo,
            fullName: `${nombre} ${apellido}`,
            phone: telefono,
            dialCode: "+57",
            documentNumber: numeroDoc,
            documentType: tipoDoc === "C.C" ? "CC" : tipoDoc,
          })
        })
        boldWindow.__boldCheckout = checkout
      }

      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) document.head.removeChild(script)
        const boldWindow = window as unknown as WindowWithBold
        delete boldWindow.__boldCheckout
      }
    }
  }, [boldIntegrity, pasoActual, orderId, totalPrecio, correo, nombre, apellido, telefono, numeroDoc, tipoDoc])

  async function handleConfirmar() {
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total: totalPrecio,
          direccionEntrega: metodoEnvio === "tienda"
            ? "Recoger en tienda - CALLE 65 #14-20 Bogotá D.C."
            : direccion,
          ciudadEntrega: metodoEnvio === "tienda" ? "Bogotá D.C" : ciudad,
          metodoPago: "BOLD",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        vaciarCarrito();
        setPedidoConfirmado(true);
      } else {
        alert("Error al procesar el pedido. Intenta de nuevo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pedido. Intenta de nuevo.");
    }
  }

  // Función para guardar datos y abrir Bold
  function abrirBold() {
    // Guardar datos para Melonn
    localStorage.setItem("checkout_datos", JSON.stringify({
      nombre,
      apellido,
      correo,
      telefono,
      direccion: metodoEnvio === "tienda" ? "CALLE 65 #14-20" : direccion,
      ciudad: metodoEnvio === "tienda" ? "Bogotá" : ciudad,
      departamento: metodoEnvio === "tienda" ? "Bogotá" : departamento,
    }))
    localStorage.setItem("checkout_items", JSON.stringify(items))

    const boldWindow = window as unknown as WindowWithBold
    const checkout = boldWindow.__boldCheckout
    if (checkout) checkout.open()
    else alert("Cargando pasarela de pagos, intenta de nuevo")
  }

  // Spinner mientras verifica sesión
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-verde border-t-transparent animate-spin"/>
      </div>
    )
  }

  if (pedidoConfirmado) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar breadcrumb={[
          { label: "Inicio", href: "/" },
          { label: "Mi carrito de compras", href: "/carrito" },
          { label: "Checkout" },
        ]}/>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 rounded-full border-2 border-verde flex items-center justify-center mb-6">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#112221" strokeWidth="1.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </motion.div>
          <h1 className="text-2xl font-semibold text-amarillo-oscuro mb-2">¡Pedido confirmado!</h1>
          <p className="text-sm text-amarillo-oscuro mb-8">Te enviamos un correo con los detalles de tu compra</p>
          <div className="bg-verde text-amarillo px-8 py-3 rounded-lg text-sm font-medium mb-4">
            Pedido: {numeroPedido}
          </div>
          <Link href="/perfil/pedidos"
            className="w-64 py-3 border border-verde text-verde text-sm font-medium text-center rounded-lg hover:bg-verde hover:text-amarillo transition-colors mb-8">
            Ver mi pedido
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar breadcrumb={[
        { label: "Inicio", href: "/" },
        { label: "Mi carrito de compras", href: "/carrito" },
        { label: "Checkout" },
      ]}/>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-10">
          {pasos.map((paso, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  i <= pasoActual ? "bg-verde border-verde" : "bg-white border-amarillo"
                }`}>
                  {i < pasoActual ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  ) : (
                    <span className={`text-sm font-medium ${i <= pasoActual ? "text-amarillo" : "text-amarillo"}`}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-1 ${i === pasoActual ? "text-verde font-semibold" : "text-amarillo"}`}>
                  {paso}
                </span>
              </div>
              {i < pasos.length - 1 && (
                <div className={`w-12 md:w-20 h-px mb-5 ${i < pasoActual ? "bg-verde" : "bg-amarillo/40"}`}/>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* Paso 1 */}
              {pasoActual === 0 && (
                <motion.div key="paso1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="bg-gray-100 rounded-xl border border-gray-400 p-6">
                  <h2 className="text-base font-semibold text-verde mb-5">Datos de entrega</h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-amarillo mb-1 block">Nombre <span className="text-red-500">*</span></label>
                      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                        placeholder="Juan" required
                        className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
                    </div>
                    <div>
                      <label className="text-xs text-amarillo mb-1 block">Apellido <span className="text-red-500">*</span></label>
                      <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
                        placeholder="Pérez" required
                        className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-amarillo mb-1 block">Tipo de documento <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)} required
                          className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none appearance-none cursor-pointer">
                          <option>C.C</option>
                          <option>C.E</option>
                          <option>NIT</option>
                          <option>Pasaporte</option>
                        </select>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-amarillo pointer-events-none">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-amarillo mb-1 block">Número de identificación <span className="text-red-500">*</span></label>
                      <input type="text" value={numeroDoc} onChange={(e) => setNumeroDoc(e.target.value)}
                        placeholder="1000000000" required
                        className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-amarillo mb-1 block">Correo electrónico <span className="text-red-500">*</span></label>
                    <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)}
                      placeholder="correo@email.com" required
                      className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-xs text-amarillo mb-1 block">Teléfono <span className="text-red-500">*</span></label>
                      <div className="flex gap-1">
                        <div className="relative w-14 flex-shrink-0">
                          <select className="w-full border border-verde rounded-lg px-1 py-2 text-xs text-verde outline-none appearance-none cursor-pointer">
                            <option>+57</option>
                          </select>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-amarillo pointer-events-none">
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        </div>
                        <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                          placeholder="300 000 0000" required
                          className="flex-1 border border-verde rounded-lg px-2 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
                      </div>
                    </div>

                    {metodoEnvio !== "tienda" && (
                      <>
                        <div>
                          <label className="text-xs text-amarillo mb-1 block">Departamento <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select value={departamento}
                              onChange={(e) => {
                                const selected = departamentos.find(d => d.name === e.target.value)
                                setDepartamento(e.target.value)
                                setDepartamentoId(selected?.id || null)
                                setCiudad("Selecciona tu ciudad")
                                setCiudades([])
                              }}
                              required
                              className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none appearance-none cursor-pointer">
                              <option value="Selecciona tu departamento">Selecciona tu departamento</option>
                              {departamentos.map((dep) => (
                                <option key={dep.id} value={dep.name}>{dep.name}</option>
                              ))}
                            </select>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-amarillo pointer-events-none">
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-amarillo mb-1 block">Ciudad <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}
                              required disabled={ciudades.length === 0}
                              className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none appearance-none cursor-pointer disabled:opacity-50">
                              <option value="Selecciona tu ciudad">
                                {cargandoCiudades ? "Cargando..." : "Selecciona tu ciudad"}
                              </option>
                              {ciudades.map((c) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-amarillo pointer-events-none">
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-amarillo mb-1 block">Barrio <span className="text-red-500">*</span></label>
                          <input type="text" value={barrio} onChange={(e) => setBarrio(e.target.value)}
                            placeholder="Chapinero" required
                            className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
                        </div>
                      </>
                    )}
                  </div>

                  {metodoEnvio === "tienda" ? (
                    <div className="bg-hueso rounded-xl border border-amarillo/30 p-4 mb-6">
                      <p className="text-sm font-semibold text-verde mb-2">Recoger en tienda</p>
                      <p className="text-xs font-medium text-verde">La llave del norte Chapinero</p>
                      <p className="text-xs text-gray-500">CALLE 65 #14-20 Bogotá D.C.</p>
                      <p className="text-xs text-gray-500">Abierto de 7:30 AM a 6:30 PM.</p>
                      <p className="text-xs text-amarillo mt-2">El pedido estará listo para recoger en 24 horas hábiles</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label className="text-xs text-amarillo mb-1 block">Dirección de entrega <span className="text-red-500">*</span></label>
                        <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)}
                          placeholder="Calle 123 # 45-67, Apto 201" required
                          className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
                      </div>
                      <div className="mb-6">
                        <label className="text-xs text-amarillo mb-1 block">Indicaciones adicionales</label>
                        <input type="text" value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)}
                          placeholder="Casa con portón azul, timbre 2"
                          className="w-full border border-verde rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo"/>
                      </div>
                    </>
                  )}

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-xs text-red-500 mb-3">
                      {error}
                    </motion.p>
                  )}

                  <button
                    onClick={() => {
                      if (!nombre || !apellido || !correo || !numeroDoc || !telefono) {
                        setError("Por favor completa todos los campos obligatorios marcados con *");
                        return;
                      }
                      if (metodoEnvio !== "tienda" && (!direccion || !barrio ||
                        departamento === "Selecciona tu departamento" || ciudad === "Selecciona tu ciudad")) {
                        setError("Por favor completa la dirección de entrega completa");
                        return;
                      }
                      setError("");
                      setPasoActual(1);
                    }}
                    className="w-full py-3 bg-verde text-amarillo text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                  >
                    Continuar
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </motion.div>
              )}

              {/* Paso 2 - Términos */}
              {pasoActual === 1 && (
                <motion.div key="paso2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="bg-gray-100 rounded-xl border border-gray-400 p-6">
                  <h2 className="text-base font-semibold text-verde mb-5">Términos y condiciones</h2>
                  <div className="bg-verde rounded-lg p-4 mb-4 h-40 overflow-y-auto">
                    <p className="text-sm text-hueso leading-relaxed">
                      Al realizar esta compra aceptas que los productos adquiridos son para uso personal o empresarial según
                      tu perfil registrado. Los productos de importación no admiten devolución una vez despachados desde
                      el país de origen. La Llave del Norte se reserva el derecho de verificar la información del pedido
                      antes de procesar el envío. Los tiempos de entrega son estimados y pueden variar según la
                      disponibilidad del producto y la zona de entrega. Para más información contáctanos por WhatsApp.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mb-6">
                    <input type="checkbox" checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      className="accent-verde w-4 h-4 cursor-pointer"/>
                    <span className="text-xs text-gray-500 cursor-pointer">
                      He leído y acepto los términos y condiciones de compra
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <button onClick={() => setPasoActual(0)}
                      className="flex-1 py-3 border border-verde text-verde text-sm font-medium rounded-lg hover:bg-verde hover:text-amarillo transition-colors cursor-pointer flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                      Volver
                    </button>
                    <button onClick={() => setPasoActual(2)} disabled={!aceptaTerminos}
                      className={`flex-1 py-3 text-sm font-medium rounded-lg transition-opacity flex items-center justify-center gap-2 ${
                        aceptaTerminos ? "bg-verde text-amarillo hover:opacity-90 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}>
                      Continuar
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Paso 3 - Pagar */}
              {pasoActual === 2 && (
                <motion.div key="paso3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} className="bg-gray-100 rounded-xl border border-gray-400 p-6">
                  <h2 className="text-base font-semibold text-verde mb-5">Método de pago</h2>
                  <div className="space-y-3 mb-6">
                    <div className="border border-amarillo bg-verde-medio rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-md font-semibold text-amarillo">Bold - Pasarela de pagos</p>
                            <p className="text-sm text-gray-300">Tarjeta débito / crédito, PSE y más</p>
                          </div>
                        </div>
                        <span className="text-xs bg-amarillo text-hueso px-2 py-1 rounded-full font-medium">Seguro</span>
                      </div>

                      {boldIntegrity ? (
                        <button
                          onClick={abrirBold}
                          className="w-full py-3 bg-hueso text-verde text-sm font-bold rounded-4xl hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          Pagar ahora con Bold
                        </button>
                      ) : (
                        <div className="flex items-center justify-center py-3">
                          <div className="w-5 h-5 rounded-full border-2 border-amarillo border-t-transparent animate-spin"/>
                          <span className="text-xs text-gray-300 ml-2">Cargando pasarela...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setPasoActual(1)}
                      className="flex-1 py-3 border border-verde text-verde text-sm font-medium rounded-lg hover:bg-verde hover:text-amarillo transition-colors cursor-pointer flex items-center justify-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                      Volver
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <ResumenPedido items={items} totalPrecio={totalPrecio as number}/>
          </div>
        </div>
      </div>
    </div>
  );
}