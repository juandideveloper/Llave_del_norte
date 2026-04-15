import Link from "next/link";
import Image from "next/image";
import Pendiente from "@/public/images/Pendiente.png";

export default function PendienteAprobacionPage() {
  return (
    <div className="pendiente-container min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-md shadow-sm text-center">
        <div className="w-28 h-28  rounded-full flex items-center justify-center mx-auto mb-3 bg-hueso ">
          <Image
            src={Pendiente}
            alt="Pendiente por aprobación"
            width={55}
            height={55}
          />
        </div>
        <h1 className="text-2xl font-semibold text-hueso">Solicitud enviada</h1>
        <p className="text-base text-amarillo mb-6">
          Tu cuenta está pendiente de verificación
        </p>
        <div className="inline-flex items-center gap-2 text-amarillo text-xs px-4 py-2 rounded-full mb-6  bg-verde">
          <div className="w-2 h-2 rounded-full bg-amarillo"></div>
          Pendiente de aprobación
        </div>
        <div className="bg-hueso rounded-md p-3 border border-gray-100 mb-6">
          <p className="text-xs text-gray-800 leading-relaxed">
            Nuestro equipo revisará tu información y te notificará por correo en{" "}
            <strong className="text-verde">máximo 48 horas hábiles</strong>.
            Mientras tanto puedes navegar el catálogo con precios de vitrina.
          </p>
        </div>

        <Link
          href="/catalogo"
          className="block w-full py-2.5 rounded-md text-sm font-medium bg-hueso/60 text-verde hover:bg-hueso transition-opacity cursor-pointer"
        >
          Ir al catálogo
        </Link>
        <div className="text-center mt-4 w-full py-2.5 rounded-b-md text-xs font-medium text-amarillo hover:bg-verde hover:text-hueso transition-opacity cursor-pointer">
          <Link href="/login" className="text-xs">
            ← Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
