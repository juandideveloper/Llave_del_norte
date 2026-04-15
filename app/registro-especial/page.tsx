"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputPassword from "@/components/ui/InputPassword";
import { motion, AnimatePresence } from "framer-motion";

export default function RegistroEspecialPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
    telefono: "",
    empresa: "",
    nit: "",
    tipoCliente: "",
    volumenEstimado: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
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
      const res = await fetch("/api/auth/registro-especial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          telefono: form.telefono,
          empresa: form.empresa,
          nit: form.nit,
          tipoCliente: form.tipoCliente,
          volumenEstimado: form.volumenEstimado,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setCargando(false);
        return;
      }

      // Redirigimos a una página de espera de aprobación
      router.push("/pendiente-aprobacion");
    } catch (error) {
      setError("Error de conexión, intenta de nuevo");
      setCargando(false);
    }
  }

  return (
    <div className="registro-especial-container min-h-screen flex items-center justify-center py-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-md shadow-sm">        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-hueso">
            Registro como importador
          </h1>
          <p className="text-sm text-amarillo mt-1">
            Accede a precios mayoristas exclusivos tras verificación
          </p>
        </div>

        <form onSubmit={handleRegistro} className="space-y-4">
          {/* Datos personales */}
          <div className="grid grid-cols-2 gap-4">
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
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                name="telefono"
                type="text"
                value={form.telefono}
                onChange={handleChange}
                placeholder="300 000 0000"
                required
                className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white"
              />
            </div>
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
              placeholder="correo@empresa.com"
              required
              className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white"
            />
          </div>

          {/* Datos empresariales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-hueso mb-1 block">
                Empresa / Razón social <span className="text-red-500">*</span>
              </label>
              <input
                name="empresa"
                type="text"
                value={form.empresa}
                onChange={handleChange}
                placeholder="Constructora XYZ S.A.S"
                required
                className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white"
              />
            </div>
            <div>
              <label className="text-xs text-hueso mb-1 block">
                NIT <span className="text-red-500">*</span>
              </label>
              <input
                name="nit"
                type="text"
                value={form.nit}
                onChange={handleChange}
                placeholder="900.123.456-7"
                required
                className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-hueso mb-1 block">
              Tipo de cliente <span className="text-red-500">*</span>
            </label>
            <select
              name="tipoCliente"
              value={form.tipoCliente}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white cursor-pointer"
            >
              <option value="" className="bg-verde cursor-pointer">Selecciona una opción...</option>
              <option value="arquitecto" className="bg-verde cursor-pointer">Arquitecto</option>
              <option value="constructora" className="bg-verde cursor-pointer">Empresa constructora</option>
              <option value="distribuidor" className="bg-verde cursor-pointer">Distribuidor</option>
              <option value="mayorista" className="bg-verde cursor-pointer">Particular mayorista</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-hueso mb-1 block">
              Volumen estimado de compra mensual{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="volumenEstimado"
              value={form.volumenEstimado}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md text-sm outline-none border border-white focus:border-amarillo  text-white cursor-pointer"
            >
              <option value="" className="bg-verde cursor-pointer">Selecciona un rango...</option>
              <option value="menos1m" className="bg-verde cursor-pointer">Menos de $1.000.000</option>
              <option value="1m-5m" className="bg-verde cursor-pointer">$1.000.000 — $5.000.000</option>
              <option value="5m-20m" className="bg-verde cursor-pointer">$5.000.000 — $20.000.000</option>
              <option value="mas20m" className="bg-verde cursor-pointer">Más de $20.000.000</option>
            </select>
          </div>

          {/* Contraseñas */}
          <div className="grid grid-cols-2 gap-4">
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
                onChange={(e) =>
                  setForm({ ...form, confirmar: e.target.value })
                }
                placeholder="Repite tu contraseña"
                required
              />
            </div>
          </div>

          {/* Info de aprobación */}
          <div className="bg-hueso rounded-md p-3 border border-gray-100">
            <p className="text-xs text-gray-800 leading-relaxed">
              Tu solicitud será revisada por nuestro equipo en{" "}
              <strong className="text-verde">máximo 48 horas hábiles</strong>.
              Recibirás un correo con la respuesta.
            </p>
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
            disabled={cargando}
            className="w-full py-2.5 rounded-b-md text-sm font-medium bg-hueso/60 text-verde hover:bg-hueso transition-opacity cursor-pointer"
          >
            {cargando ? "Enviando solicitud..." : "Enviar solicitud"}
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
            ¿Solo quieres comprar unidades?{" "}
            <Link href="/registro" className="text-amarillo hover:text-amarillo">
              Registro normal
            </Link>
          </p>
        </div>
      </div> 
    </div>
  );
}
