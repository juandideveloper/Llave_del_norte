"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/ui/Navbar"
import Link from "next/link"

export default function MiPerfilPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [barrio, setBarrio] = useState("")
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/perfil/perfil")
  }, [status, router])

  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/perfil")
      .then(res => res.json())
      .then(data => {
        if (data.cliente) {
          setNombre(data.cliente.nombre || "")
          setTelefono(data.cliente.telefono || "")
          setDireccion(data.cliente.direccion || "")
          setCiudad(data.cliente.ciudad || "")
          setBarrio(data.cliente.barrio || "")
        }
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [status])

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      const res = await fetch("/api/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, telefono, direccion, ciudad, barrio })
      })
      const data = await res.json()
      if (data.ok) {
        setMensaje({ ok: true, texto: "Perfil actualizado correctamente" })
        await update({ name: nombre })
      } else {
        setMensaje({ ok: false, texto: "Error al actualizar el perfil" })
      }
    } catch {
      setMensaje({ ok: false, texto: "Error al actualizar el perfil" })
    } finally {
      setGuardando(false)
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-verde border-t-transparent animate-spin"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Mi perfil" }]}/>
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-verde">Mi perfil</h1>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
          </div>
          <Link href="/perfil/pedidos"
            className="text-xs text-verde border border-verde px-3 py-1.5 rounded-lg hover:bg-verde hover:text-amarillo transition-colors">
            Mis pedidos
          </Link>
        </div>

        {cargando ? (
          <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg"/>
            ))}
          </div>
        ) : (
          <form onSubmit={handleGuardar} className="space-y-4">

            {/* Datos personales */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-verde mb-4">Datos personales</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Nombre completo</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Correo electrónico</label>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"/>
                  <p className="text-xs text-gray-300 mt-1">El correo no se puede cambiar</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Teléfono</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value)}
                    placeholder="300 000 0000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-verde mb-4">Dirección de entrega</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 mb-1 block">Dirección</label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={e => setDireccion(e.target.value)}
                    placeholder="Calle 123 # 45-67"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Ciudad</label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={e => setCiudad(e.target.value)}
                    placeholder="Bogotá"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Barrio</label>
                  <input
                    type="text"
                    value={barrio}
                    onChange={e => setBarrio(e.target.value)}
                    placeholder="Chapinero"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-verde"/>
                </div>
              </div>
            </div>

            {/* Tipo de cuenta */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-verde mb-3">Tipo de cuenta</h2>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  session?.user?.role === "ESPECIAL" ? "bg-amarillo/20 text-amarillo-oscuro" : "bg-gray-100 text-gray-500"
                }`}>
                  {session?.user?.role === "ESPECIAL" ? "Cliente Mayorista" :
                   session?.user?.role === "ADMIN" ? "Administrador" : "Cliente Regular"}
                </span>
                {session?.user?.role === "NORMAL" && (
                  <Link href="/registro-especial"
                    className="text-xs text-verde hover:underline">
                    ¿Quieres precios mayoristas?
                  </Link>
                )}
              </div>
            </div>

            {mensaje && (
              <div className={`text-xs px-4 py-3 rounded-lg ${
                mensaje.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              }`}>
                {mensaje.texto}
              </div>
            )}

            <button
              type="submit"
              disabled={guardando}
              className="w-full py-3 bg-verde text-amarillo text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}