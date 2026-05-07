"use client"

import { useState, useRef } from "react"

export default function FormBoletin({ totalSuscriptores }: { totalSuscriptores: number }) {
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null)
  const inputArchivoRef = useRef<HTMLInputElement>(null)

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault()
    if (!asunto || !mensaje) return

    setEnviando(true)
    setResultado(null)

    try {
      const formData = new FormData()
      formData.append("asunto", asunto)
      formData.append("mensaje", mensaje)
      if (archivo) formData.append("archivo", archivo)

      const res = await fetch("/api/boletin", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.ok) {
        setResultado({ ok: true, mensaje: `Boletín enviado a ${totalSuscriptores} suscriptores` })
        setAsunto("")
        setMensaje("")
        setArchivo(null)
        if (inputArchivoRef.current) inputArchivoRef.current.value = ""
      } else {
        setResultado({ ok: false, mensaje: data.error || "Error al enviar el boletín" })
      }
    } catch {
      setResultado({ ok: false, mensaje: "Error al enviar el boletín" })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleEnviar} className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <h2 className="text-sm font-semibold text-verde mb-4">Enviar nuevo boletín</h2>

      <input
        type="text"
        value={asunto}
        onChange={e => setAsunto(e.target.value)}
        placeholder="Asunto del correo..."
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo mb-3"/>

      <textarea
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
        placeholder="Escribe el mensaje para tus suscriptores..."
        rows={5}
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo mb-3 resize-none"/>

      {/* Adjuntar archivo */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">Adjuntar archivo (opcional)</label>
        <div className="flex items-center gap-3">
          <input
            ref={inputArchivoRef}
            type="file"
            onChange={e => setArchivo(e.target.files?.[0] || null)}
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
            className="hidden"/>
          <button
            type="button"
            onClick={() => inputArchivoRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:border-verde hover:text-verde transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
            {archivo ? archivo.name : "Seleccionar archivo"}
          </button>
          {archivo && (
            <button
              type="button"
              onClick={() => {
                setArchivo(null)
                if (inputArchivoRef.current) inputArchivoRef.current.value = ""
              }}
              className="text-xs text-red-400 hover:text-red-600 cursor-pointer">
              Quitar
            </button>
          )}
        </div>
        <p className="text-xs text-gray-300 mt-1">PDF, imágenes, Excel o Word. Máx 5MB</p>
      </div>

      {resultado && (
        <div className={`text-xs px-3 py-2 rounded-lg mb-3 ${
          resultado.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
        }`}>
          {resultado.mensaje}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Se enviará a <span className="font-medium text-verde">{totalSuscriptores}</span> suscriptores
        </p>
        <button
          type="submit"
          disabled={enviando || totalSuscriptores === 0}
          className="px-4 py-2 bg-verde text-amarillo text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-2">
          {enviando ? (
            <>
              <div className="w-3 h-3 rounded-full border border-amarillo border-t-transparent animate-spin"/>
              Enviando...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
              Enviar boletín
            </>
          )}
        </button>
      </div>
    </form>
  )
}