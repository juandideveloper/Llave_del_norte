"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputPassword from "@/components/ui/InputPassword";
import { motion, AnimatePresence } from "framer-motion";

export default function RegistroPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exitoso, setExitoso] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (form.password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          telefono: form.telefono,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setCargando(false);
        return;
      }

      // Mostramos mensaje de éxito y redirigimos después de 2 segundos
      setExitoso(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setError("Error de conexión, intenta de nuevo");
      setCargando(false);
    }
  }

  return (
    <div className="registro-container min-h-screen flex items-center justify-center py-8 ">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-md shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-hueso">
            Crear cuenta
          </h1>
          <p className="text-base text-amarillo mt-1">
            Compra productos al precio de vitrina
          </p>
        </div>

        <AnimatePresence>
          {exitoso && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.9 }}
              className="bg-green-50 border border-green-200 rounded-md p-3 mb-4"
            >
              <p className="text-green-700 text-sm text-center">
                ✓ Cuenta creada exitosamente. Redirigiendo al login...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegistro} className="space-y-4">
          <div>
            <label className="text-xs text-hueso mb-1 block">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
              className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white"
            />
          </div>

          <div>
            <label className="text-xs text-hueso mb-1 block">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@email.com"
              required
              className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white"
            />
          </div>

          <div>
            <label className="text-xs text-hueso mb-1 block">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              name="telefono"
              type="text"
              value={form.telefono}
              onChange={handleChange}
              placeholder="300 000 0000"
              className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white"
            />
          </div>

          <div>
            <label className="text-xs text-hueso mb-1 block">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <InputPassword
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          <div>
            <label className="text-xs text-hueso mb-1 block">
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <InputPassword
              value={form.confirmar}
              onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
              placeholder="Repite tu contraseña"
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
                className="text-red-500 text-xs"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={cargando || exitoso}
            className="w-full py-2.5 rounded-b-md text-sm font-medium bg-hueso/60 text-verde hover:bg-hueso transition-opacity cursor-pointer "
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <p className="text-xs text-gray-200">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-amarillo hover:text-amarillo">
              Inicia sesión
            </Link>
          </p>
          <p className="text-xs text-gray-200">
            ¿Quieres precios mayoristas?{" "}
            <Link href="/registro-especial" className="text-amarillo hover:text-amarillo">
              Regístrate como importador
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
