"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import InputPassword from "@/components/ui/InputPassword";
import { motion, AnimatePresence } from "framer-motion";

function NuevaPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exitoso, setExitoso] = useState(false);

  async function handleNuevaPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener minimo 8 caracteres");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("/api/auth/nueva-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "El enlace no es valido o ya expiro");
        setCargando(false);
        return;
      }

      setExitoso(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setError("Error de conexion, intenta de nuevo");
      setCargando(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-500 text-sm">Enlace no valido</p>
        <Link href="/login" className="text-amarillo text-sm mt-2 block">
          Volver al login
        </Link>
      </div>
    );
  }

  if (exitoso) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-amarillo/10 border border-amarillo">
          <span className="text-2xl text-verde">✓</span>
        </div>
        <h2 className="text-lg font-medium text-verde mb-2">
          Contraseña actualizada
        </h2>
        <p className="text-sm text-gray-400">
          Te redirigimos al login en unos segundos...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-verde">
          <span className="text-xl font-medium text-amarillo">L</span>
        </div>
        <h1 className="text-xl font-medium text-verde">Nueva contrasena</h1>
        <p className="text-sm text-gray-400 mt-1">
          Escribe tu nueva contraseña
        </p>
      </div>

      <form onSubmit={handleNuevaPassword} className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Nueva contraseña
          </label>
          <InputPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Confirmar contrasena
          </label>
          <InputPassword
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className=" bg-red-100 border border-red-300 rounded-md p-2"
            >
              <p className="text-red-600 text-sm font-medium text-center items-center">{error}</p>
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-2.5 rounded-md text-sm font-medium bg-verde text-amarillo hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {cargando ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>

      <div className="text-center mt-4">
        <Link href="/login" className="text-xs text-amarillo">
          Volver al login
        </Link>
      </div>
    </>
  );
}

export default function NuevaPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-hueso">
      <div className="bg-white rounded-xl p-8 w-full max-w-md border border-gray-100 shadow-sm">
        <Suspense
          fallback={
            <p className="text-center text-sm text-gray-400">Cargando...</p>
          }
        >
          <NuevaPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
