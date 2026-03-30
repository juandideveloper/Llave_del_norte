"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const resultado = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (resultado?.error) {
      setError("Email o contraseña incorrectos");
      setCargando(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-hueso">
      <div className="bg-white rounded-xl p-8 w-full max-w-md border-gray-100 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-verde">
            <span className="text-xl font-medium text-amarillo">L</span>
          </div>
          <h1 className="text-xl font-medium text-verde">Bienvenido</h1>
          <p className="text-sm text-gray-400 mt-1">
            Inicia sesión en tu cuenta
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full px-3 py-2 rounded-md text-sm outline-none border border-gray-200 focus:border-amarillo bg-hueso text-verde"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 rounded-md text-sm outline-none border border-gray-200 focus:border-amarillo bg-hueso text-verde "
            />
          </div>
          <div className="text-right">
            <Link href="/recuperar-password" className="text-xs text-amarillo">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-2.5 rounded-b-md text-sm font-medium bg-verde text-amarillo hover:opacity-90 transition-opacity"
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
        <div className="text-center mt-4 space-y-2">
          <p className="text-xs text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="text-amarillo">
              Crear cuenta 
            </Link>
          </p>
          <p className="text-xs text-gray-400">
            ¿Quieres precios mayoritas?{""}
            <Link href="/registro-especial" className="text-amarillo">
              Regístrate como importador
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
