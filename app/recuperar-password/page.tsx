"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function handleRecuperar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const res = await fetch("api/auth/recuperar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setCargando(false);
      return;
    }

    setEnviado(true);
    setCargando(false);
  }

  return (
    <div className="recuperar-container min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-md shadow-sm">
        {!enviado ? (
          <>
            <div className="text-center mb-6">
              <div className="w-28 h-28  rounded-full flex items-center justify-center mx-auto mb-3 bg-hueso">
                <span>
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="70.00000pt"
                    height="70.00000pt"
                    viewBox="0 0 325.000000 321.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,321.000000) scale(0.100000,-0.100000)"
                      fill="#112221"
                      stroke="none"
                    >
                      <path
                        d="M2285 2775 c-138 -30 -257 -96 -374 -209 -176 -170 -290 -352 -424
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
                    120 -50 180 -81z"
                      />
                    </g>
                  </svg>
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-hueso">
                Recuperar Contraseña
              </h1>
              <p className="text-base text-amarillo mt-1">
                Ingresa tu email y te enviaremos un enlace
              </p>
            </div>

            <form onSubmit={handleRecuperar} className="space-y-4">
              <div>
                <label className="text-sm text-amarillo mb-1 block">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@email.com"
                  required
                  className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white"
                />
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9 }}
                    className="text-red-500 text-xs"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-2.5 rounded-b-md text-sm font-medium bg-hueso/60 text-verde hover:bg-hueso transition-opacity cursor-pointer"
              >
                {cargando ? "Enviando..." : "Enviar enlace de recupeción"}
              </button>
            </form>
            <div className="text-center mt-4 w-full py-2.5 rounded-b-md text-xs font-medium text-amarillo hover:bg-verde hover:text-hueso transition-opacity cursor-pointer">
              <Link href="/login">
                ← Volver al login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-amarillo-claro border-2 border-amarillo">
              <span className="text-4xl text-amarillo">✓</span>
            </div>
            <h2 className="text-lg font-medium text-amarillo mb-2">
              ¡Correo enviado!
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              Si el correo esta registrado recibiras un enlace para restablecer
              tu contraseña. Revisa también tu carpeta de spam.
            </p>
            <Link href="/login" className="text-xs text-amarillo">
              ← Volver al login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
