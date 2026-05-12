"use client"

import Link from "next/link"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [aceptado, setAceptado] = useState(false)
  const [estado, setEstado] = useState<"idle" | "cargando" | "ok" | "error">("idle")

  async function handleSuscribir() {
    if (!email || !aceptado) return
    setEstado("cargando")
    try {
      const res = await fetch("/api/suscriptores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.ok) {
        setEstado("ok")
        setEmail("")
        setAceptado(false)
      } else {
        setEstado("error")
      }
    } catch {
      setEstado("error")
    }
  }

  return (
    <footer id="contacto" className="bg-verde px-4 md:px-8 py-10 md:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1px_1fr_1px_1fr] gap-6 mb-8 items-start">

        {/* Columna 1 - Info */}
        <div>
          <Link href="/">
            <svg version="1.0" width="70.000000pt" height="70.000000pt" viewBox="0 0 3264.000000 1884.000000" preserveAspectRatio="xMidYMid meet" fill="#e1b86b">
              <g transform="translate(0.000000,1884.000000) scale(0.100000,-0.100000)" fill="#e1b86b" stroke="none">
                <path d="M3796 17839 c-7 -21 -33 -154 -46 -234 -6 -38 -20 -117 -30 -175 -10 -58 -26 -148 -35 -200 -9 -52 -23 -124 -30 -160 -8 -36 -23 -123 -35 -195 -12 -71 -27 -159 -35 -195 -7 -36 -18 -103 -25 -150 -6 -47 -17 -114 -25 -150 -8 -36 -23 -123 -35 -195 -12 -71 -30 -175 -41 -230 -11 -55 -24 -125 -30 -155 -5 -30 -14 -75 -19 -100 -5 -25 -17 -92 -25 -150 -9 -58 -24 -139 -32 -180 -9 -41 -19 -97 -24 -125 -4 -27 -12 -75 -18 -105 -22 -121 -84 -478 -92 -525 -11 -68 -45 -262 -64 -365 -8 -47 -20 -112 -25 -145 -6 -33 -14 -80 -19 -105 -22 -111 -53 -281 -86 -470 -19 -113 -40 -227 -46 -255 -6 -27 -21 -113 -34 -190 -13 -77 -40 -232 -60 -345 -20 -113 -47 -268 -60 -345 -13 -77 -38 -214 -55 -305 -17 -91 -43 -230 -56 -310 -14 -80 -29 -165 -33 -190 -61 -321 -132 -730 -134 -765 -2 -28 0 -30 37 -30 46 0 50 6 66 100 7 39 16 86 20 105 5 19 14 67 19 105 6 39 21 122 32 185 12 63 25 139 30 168 5 28 13 76 18 105 20 115 51 296 61 357 6 36 15 85 20 110 5 25 28 155 50 290 38 224 72 413 118 655 l17 90 559 3 c372 1 563 -1 570 -8 10 -10 47 -193 67 -330 10 -74 22 -143 40 -230 5 -25 21 -112 34 -195 14 -82 32 -188 41 -235 8 -47 19 -107 24 -135 4 -27 15 -88 24 -135 8 -47 25 -141 37 -210 11 -69 25 -145 29 -170 23 -121 53 -290 75 -430 14 -85 30 -165 35 -177 10 -23 11 -23 235 -23 171 0 227 3 230 13 3 6 -6 75 -20 152 -15 77 -39 219 -56 315 -16 96 -33 190 -38 210 -6 19 -15 73 -21 120 -6 47 -14 105 -19 130 -5 25 -21 117 -36 205 -14 88 -31 180 -36 205 -6 25 -19 95 -29 155 -28 160 -90 513 -100 565 -4 25 -13 72 -18 105 -6 33 -27 155 -47 270 -20 116 -40 235 -45 265 -5 30 -16 93 -24 140 -9 47 -23 130 -31 185 -9 55 -20 120 -25 145 -4 25 -13 72 -19 105 -6 33 -20 105 -31 160 -11 55 -27 147 -35 205 -9 58 -24 150 -35 205 -43 230 -79 433 -85 480 -3 28 -15 93 -25 145 -10 52 -22 118 -25 145 -4 28 -19 118 -35 200 -16 83 -32 177 -36 210 -3 33 -13 89 -21 125 -16 77 -31 154 -43 230 -28 177 -73 438 -90 520 -11 52 -29 151 -41 220 -11 69 -25 149 -30 178 -5 28 -13 76 -18 105 -79 473 -109 638 -116 645 -2 3 -7 -1 -9 -9z m-171 -1636 c4 -27 18 -104 31 -173 14 -69 32 -165 39 -215 20 -123 71 -413 90 -510 9 -44 20 -105 25 -135 5 -30 14 -82 20 -115 12 -66 20 -111 49 -293 11 -68 25 -147 31 -175 5 -29 24 -133 41 -232 16 -99 43 -250 59 -335 16 -85 36 -200 45 -255 9 -55 20 -120 25 -145 5 -25 18 -99 30 -165 12 -66 28 -153 36 -193 8 -40 12 -77 9 -83 -4 -5 -222 -9 -551 -9 -537 0 -544 0 -544 20 0 22 30 202 35 210 2 3 13 61 25 130 19 117 54 319 85 490 7 41 18 107 24 145 11 66 40 235 62 355 6 30 14 80 19 110 4 30 17 100 29 155 11 55 28 147 37 205 9 58 21 125 25 150 5 25 13 72 18 105 5 33 23 134 40 225 17 91 36 194 42 230 6 36 17 97 24 135 8 39 16 93 20 120 10 76 46 279 51 287 12 19 23 4 29 -39z"/>
              </g>
            </svg>
          </Link>
          <div className="space-y-3 mt-2">
            <div className="flex items-start gap-2 text-sm text-hueso/50">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="#C5973D" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.0354 19.399C6.01179 18.8872 5.49998 18.2264 5.49998 17.4167C5.49998 17.05 5.61074 16.7101 5.83227 16.3969C6.0538 16.0837 6.36317 15.8125 6.7604 15.5833L8.20415 16.9354C8.06665 16.9965 7.91769 17.0653 7.75727 17.1417C7.59685 17.2181 7.47081 17.3097 7.37915 17.4167C7.57776 17.6611 8.03609 17.875 8.75415 18.0583C9.4722 18.2417 10.2208 18.3333 11 18.3333C11.7791 18.3333 12.5316 18.2417 13.2573 18.0583C13.983 17.875 14.4451 17.6611 14.6437 17.4167C14.5368 17.2944 14.3993 17.1951 14.2312 17.1187C14.0632 17.0424 13.9028 16.9736 13.75 16.9125L15.1708 15.5375C15.5986 15.7819 15.9271 16.0608 16.1562 16.374C16.3854 16.6872 16.5 17.0347 16.5 17.4167C16.5 18.2264 15.9882 18.8872 14.9646 19.399C13.941 19.9108 12.6194 20.1667 11 20.1667C9.38054 20.1667 8.05901 19.9108 7.0354 19.399ZM11.0229 15.125C12.5354 14.0097 13.6736 12.8906 14.4375 11.7677C15.2014 10.6448 15.5833 9.51805 15.5833 8.3875C15.5833 6.82917 15.0868 5.65278 14.0937 4.85833C13.1007 4.06389 12.0694 3.66667 11 3.66667C9.93054 3.66667 8.89929 4.06389 7.90623 4.85833C6.91317 5.65278 6.41665 6.82917 6.41665 8.3875C6.41665 9.41111 6.79095 10.4767 7.53956 11.5844C8.28817 12.692 9.44929 13.8722 11.0229 15.125ZM11 17.4167C8.84581 15.8278 7.23783 14.2847 6.17602 12.7875C5.11422 11.2903 4.58331 9.82361 4.58331 8.3875C4.58331 7.30278 4.7781 6.35173 5.16769 5.53437C5.55727 4.71701 6.05762 4.03333 6.66873 3.48333C7.27984 2.93333 7.96734 2.52083 8.73123 2.24583C9.49512 1.97083 10.2514 1.83333 11 1.83333C11.7486 1.83333 12.5048 1.97083 13.2687 2.24583C14.0326 2.52083 14.7201 2.93333 15.3312 3.48333C15.9423 4.03333 16.4427 4.71701 16.8323 5.53437C17.2219 6.35173 17.4166 7.30278 17.4166 8.3875C17.4166 9.82361 16.8857 11.2903 15.8239 12.7875C14.7621 14.2847 13.1541 15.8278 11 17.4167ZM11 10.0833C11.5041 10.0833 11.9357 9.90382 12.2948 9.54479C12.6538 9.18576 12.8333 8.75417 12.8333 8.25C12.8333 7.74583 12.6538 7.31423 12.2948 6.95521C11.9357 6.59618 11.5041 6.41667 11 6.41667C10.4958 6.41667 10.0642 6.59618 9.70519 6.95521C9.34616 7.31423 9.16665 7.74583 9.16665 8.25C9.16665 8.75417 9.34616 9.18576 9.70519 9.54479C10.0642 9.90382 10.4958 10.0833 11 10.0833Z" fill="#C5973D"/>
              </svg>
              CALLE 65 #14-24, <br/> Bogotá, Colombia
            </div>
            <div className="flex items-center gap-2 text-sm text-hueso/50">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#C5973D" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.05C3 3.75 3.1 3.5 3.3 3.3C3.5 3.1 3.75 3 4.05 3H8.1C8.31667 3 8.5125 3.075 8.6875 3.225C8.8625 3.375 8.98333 3.56667 9.05 3.8L9.75 7.25C9.78333 7.48333 9.7625 7.72083 9.6875 7.9625C9.6125 8.20417 9.5 8.4 9.35 8.55L7 10.9C7.36667 11.5333 7.77083 12.1333 8.2125 12.7C8.65417 13.2667 9.13333 13.8083 9.65 14.325C10.1833 14.875 10.7375 15.3792 11.3125 15.8375C11.8875 16.2958 12.4833 16.6917 13.1 17.025L15.55 14.6C15.6833 14.4667 15.8417 14.375 16.025 14.325C16.2083 14.275 16.4333 14.2667 16.7 14.3L20.2 14.95C20.4167 14.9833 20.6042 15.0917 20.7625 15.275C20.9208 15.4583 21 15.6667 21 15.9V19.95C21 20.25 20.9 20.5 20.7 20.7C20.5 20.9 20.25 21 19.95 21C17.8667 21 15.8083 20.5458 13.775 19.6375C11.7417 18.7292 9.89167 17.4417 8.225 15.775C6.55833 14.1083 5.27083 12.2583 4.3625 10.225C3.45417 8.19167 3 6.13333 3 4.05ZM15 17.95C15.65 18.2333 16.3083 18.45 16.975 18.6C17.6417 18.75 18.3167 18.8667 19 18.95V16.75L16.65 16.3L15 17.95ZM6.1 9L7.75 7.35L7.25 5H5.05C5.1 5.68333 5.21667 6.35833 5.4 7.025C5.58333 7.69167 5.81667 8.35 6.1 9Z" fill="#C5973D"/>
              </svg>
              3134866451
            </div>
            <div className="flex items-center gap-2 text-sm text-hueso/50">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM12 13L4 8V18H20V8L12 13ZM12 11L20 6H4L12 11ZM4 8V6V18V8Z" fill="#C59C4D"/>
              </svg>
              al.lallavedelnorte1@gmail.com
            </div>
          </div>
        </div>

        {/* Separador vertical */}
        <div className="hidden lg:block w-px bg-white/20 self-stretch"/>

        {/* Columna 2 - Links */}
        <div>
          <p className="text-hueso/40 text-xs uppercase tracking-wider mb-6">Acerca de</p>
          <div className="space-y-4 md:space-y-5">
            {["Nuestra infraestructura", "Equipo", "Afiliados", "Accede a tu cuenta"].map((link) => (
              <p key={link} className="text-sm text-hueso/60 hover:text-amarillo transition-colors cursor-pointer">{link}</p>
            ))}
          </div>
        </div>

        {/* Separador */}
        <div className="lg:hidden col-span-1 sm:col-span-2 border-t border-white/20"/>
        <div className="hidden lg:block w-px bg-white/20 self-stretch"/>

        {/* Columna 3 - Suscripción */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-verde-claro rounded-lg p-6">
          <p className="text-xs text-hueso/60 uppercase tracking-wider mb-1">Suscríbete</p>
          <p className="text-sm text-hueso/80 mb-4">Recibe ofertas, novedades y mucho más</p>

          {estado === "ok" ? (
            <div className="text-center py-4">
              <p className="text-amarillo text-sm font-medium mb-1">¡Gracias por suscribirte!</p>
              <p className="text-xs text-hueso/50">Pronto recibirás nuestras novedades.</p>
            </div>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                className="w-full px-3 py-2.5 rounded-md text-sm bg-verde border border-white/10 text-hueso placeholder-hueso/30 outline-none focus:border-amarillo mb-3"
              />
              <div className="flex items-start gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={aceptado}
                  onChange={e => setAceptado(e.target.checked)}
                  className="mt-0.5 accent-amarillo cursor-pointer"
                />
                <p className="text-xs text-hueso/40 leading-relaxed">
                  He leído y acepto la{" "}
                  <Link href="/politica-privacidad" className="text-amarillo hover:underline">
                    política de privacidad
                  </Link>
                </p>
              </div>

              {estado === "error" && (
                <p className="text-xs text-red-400 mb-3">Error al suscribirse. Intenta de nuevo.</p>
              )}

              <button
                onClick={handleSuscribir}
                disabled={!email || !aceptado || estado === "cargando"}
                className="w-full py-2.5 bg-verde text-hueso text-sm font-medium rounded-md hover:opacity-90 transition-opacity border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                {estado === "cargando" ? "Suscribiendo..." : "Quiero suscribirme"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-hueso/40 text-center md:text-left">
          © 2025 LA LLAVE DEL NORTE. <br/>
          Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-4">
          <p className="text-xs text-hueso/40">¡Síguenos!</p>
          <a href="https://wa.me/573134866451" target="_blank" rel="noopener noreferrer" className="text-hueso/50 hover:text-amarillo transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@lallavedelnorte1" target="_blank" rel="noopener noreferrer" className="text-hueso/50 hover:text-amarillo transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/lallavedelnorte/" target="_blank" rel="noopener noreferrer" className="text-hueso/50 hover:text-amarillo transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}