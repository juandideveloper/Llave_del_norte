"use client"

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function CuentaAprobadaPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      localStorage.setItem(`aprobado_visto_${session.user.email}`, "true");
    }
  }, [session]);

  return (
    <div className="aprobacion-container min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-md shadow-sm text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-3 border-amarillo">
          <svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffcc6dea"
            strokeWidth="1.5"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-hueso mb-2">
          ¡Cuenta aprobada!
        </h1>
        <p className="text-sm text-amarillo mb-6">
          Ya puedes acceder a los precios mayoristas exclusivos.
        </p>

        <div className="bg-hueso rounded-md p-4 text-left mb-6 border border-gray-100">
          <p className="text-xs text-verde leading-relaxed">
            Ahora tienes acceso a:
          </p>
          <ul className="mt-2 space-y-1">
            <li className="text-xs text-verde flex items-center gap-2">
              <span className="text-green-500">✓</span> Precios mayoristas
              exclusivos
            </li>
            <li className="text-xs text-verde flex items-center gap-2">
              <span className="text-green-500">✓</span> Seguimiento de
              importaciones
            </li>
            <li className="text-xs text-verde flex items-center gap-2">
              <span className="text-green-500">✓</span> Atención prioritaria
            </li>
          </ul>
        </div>

        <Link
          href="/catalogo"
          className="block w-full py-2.5 rounded-md text-sm font-medium bg-hueso/60 text-verde hover:bg-hueso transition-opacity cursor-pointer"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
