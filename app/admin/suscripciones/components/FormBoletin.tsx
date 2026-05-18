"use client"

import { useState, useRef } from "react"

export default function FormBoletin({ totalSuscriptores, emails }: { totalSuscriptores: number; emails: string[] }) {
  const [modo, setModo] = useState<"global" | "individual">("global")
  const [emailDestino, setEmailDestino] = useState("")
  const [asunto, setAsunto] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null)
  const inputArchivoRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData.items
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) continue
        const reader = new FileReader()
        reader.onload = (ev) => {
          const img = document.createElement("img")
          img.src = ev.target?.result as string
          img.style.maxWidth = "100%"
          img.style.borderRadius = "8px"
          img.style.margin = "8px 0"
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.deleteContents()
            range.insertNode(img)
            range.setStartAfter(img)
            range.setEndAfter(img)
            selection.removeAllRanges()
            selection.addRange(range)
          } else if (editorRef.current) {
            editorRef.current.appendChild(img)
          }
        }
        reader.readAsDataURL(file)
        return
      }
    }
  }

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault()
    if (!asunto) return
    if (modo === "individual" && !emailDestino) return

    const htmlContenido = editorRef.current?.innerHTML || ""
    if (!htmlContenido.trim()) return

    setEnviando(true)
    setResultado(null)

    try {
      const formData = new FormData()
      formData.append("asunto", asunto)
      formData.append("mensaje", htmlContenido)
      formData.append("esHtml", "true")
      formData.append("modo", modo)
      if (modo === "individual") formData.append("emailDestino", emailDestino)
      if (archivo) formData.append("archivo", archivo)

      const res = await fetch("/api/boletin", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.ok) {
        setResultado({
          ok: true,
          mensaje: modo === "global"
            ? `Boletín enviado a ${totalSuscriptores} suscriptores`
            : `Email enviado a ${emailDestino}`
        })
        setAsunto("")
        setArchivo(null)
        setEmailDestino("")
        if (editorRef.current) editorRef.current.innerHTML = ""
        if (inputArchivoRef.current) inputArchivoRef.current.value = ""
      } else {
        setResultado({ ok: false, mensaje: data.error || "Error al enviar" })
      }
    } catch {
      setResultado({ ok: false, mensaje: "Error al enviar" })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleEnviar} className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <h2 className="text-sm font-semibold text-verde mb-4">Enviar correo</h2>

      {/* Tabs modo */}
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setModo("global")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            modo === "global" ? "bg-verde text-amarillo" : "border border-gray-200 text-gray-500 hover:border-verde hover:text-verde"
          }`}>
          Global ({totalSuscriptores} suscriptores)
        </button>
        <button type="button" onClick={() => setModo("individual")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            modo === "individual" ? "bg-verde text-amarillo" : "border border-gray-200 text-gray-500 hover:border-verde hover:text-verde"
          }`}>
          Individual
        </button>
      </div>

      {/* Selector email individual */}
      {modo === "individual" && (
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">Seleccionar suscriptor</label>
          <select value={emailDestino} onChange={e => setEmailDestino(e.target.value)} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo bg-white">
            <option value="">Selecciona un email...</option>
            {emails.map(email => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>
      )}

      <input
        type="text"
        value={asunto}
        onChange={e => setAsunto(e.target.value)}
        placeholder="Asunto del correo..."
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo mb-3"/>

      {/* Editor con soporte de pegar imágenes */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 mb-1 block">Mensaje (puedes pegar imágenes con Ctrl+V)</label>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onPaste={handlePaste}
          data-placeholder="Escribe el mensaje aquí o pega imágenes..."
          className="w-full min-h-[160px] border border-gray-200 rounded-lg px-3 py-2 text-sm text-verde outline-none focus:border-amarillo empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300"
          style={{ lineHeight: "1.6" }}
        />
      </div>

      {/* Barra de formato */}
      <div className="flex gap-1 mb-3 border border-gray-100 rounded-lg p-1 w-fit">
        {[
          { label: "B", cmd: "bold", title: "Negrita" },
          { label: "I", cmd: "italic", title: "Cursiva" },
          { label: "U", cmd: "underline", title: "Subrayado" },
        ].map(({ label, cmd, title }) => (
          <button key={cmd} type="button" title={title}
            onMouseDown={e => { e.preventDefault(); document.execCommand(cmd) }}
            className="w-7 h-7 text-xs font-medium text-verde hover:bg-gray-100 rounded transition-colors cursor-pointer">
            {label}
          </button>
        ))}
        <div className="w-px bg-gray-100 mx-1"/>
        <button type="button" title="Alinear izquierda"
          onMouseDown={e => { e.preventDefault(); document.execCommand("justifyLeft") }}
          className="w-7 h-7 text-xs text-verde hover:bg-gray-100 rounded transition-colors cursor-pointer">≡</button>
        <button type="button" title="Centrar"
          onMouseDown={e => { e.preventDefault(); document.execCommand("justifyCenter") }}
          className="w-7 h-7 text-xs text-verde hover:bg-gray-100 rounded transition-colors cursor-pointer">≡</button>
      </div>

      {/* Adjuntar archivo */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">Adjuntar archivo (opcional)</label>
        <div className="flex items-center gap-3">
          <input ref={inputArchivoRef} type="file" onChange={e => setArchivo(e.target.files?.[0] || null)}
            accept="*/*" className="hidden"/>
          <button type="button" onClick={() => inputArchivoRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:border-verde hover:text-verde transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
            {archivo ? archivo.name : "Seleccionar archivo"}
          </button>
          {archivo && (
            <button type="button" onClick={() => { setArchivo(null); if (inputArchivoRef.current) inputArchivoRef.current.value = "" }}
              className="text-xs text-red-400 hover:text-red-600 cursor-pointer">Quitar</button>
          )}
        </div>
        <p className="text-xs text-gray-300 mt-1">Cualquier tipo de archivo. Máx 5MB</p>
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
          {modo === "global"
            ? <><span className="font-medium text-verde">{totalSuscriptores}</span> suscriptores</>
            : emailDestino ? <span className="font-medium text-verde">{emailDestino}</span> : "Selecciona un suscriptor"
          }
        </p>
        <button type="submit"
          disabled={enviando || (modo === "global" && totalSuscriptores === 0) || (modo === "individual" && !emailDestino)}
          className="px-4 py-2 bg-verde text-amarillo text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center gap-2">
          {enviando ? (
            <><div className="w-3 h-3 rounded-full border border-amarillo border-t-transparent animate-spin"/>Enviando...</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>Enviar</>
          )}
        </button>
      </div>
    </form>
  )
}