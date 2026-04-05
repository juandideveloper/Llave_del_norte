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
    <div className="min-h-screen flex items-center justify-center bg-hueso">
      <div className="bg-white rounded-xl p-8 w-full max-w-md border border-gray-100 shadow-sm">
        {!enviado ? (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-verde">
                <span className="text-xl font-medium text-amarillo">L</span>
              </div>
              <h1 className="text-xl font-medium text-verde">
                Recuperar Contraseña
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Ingresa tu email y te enviaremos un enlace
              </p>
            </div>

            <form onSubmit={handleRecuperar} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@email.com"
                  required
                  className="w-full px-3 py-2 rounded-md text-sm ountline-none border border-gray-200 focus:border-amarillo bg-hueso text-verde"
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
                className="w-full py-2.5 rounded-md text-sm font-medium bg-verde text-amarillo hover:opacity-90 transition-opacity"
              >
                {cargando ? "Enviando..." : "Enviar enlace de recupeción"}
              </button>
            </form>
            <div className="text-center mt-4">
              <Link href="/login" className="text-xs text-amarillo">
                ← Volver al login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-amarillo-claro border border-amarillo">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-lg font-medium text-verde mb-2">
              ¡Correo enviado!
            </h2>
            <p className="text-sm text-gray-400 mb-6">
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
