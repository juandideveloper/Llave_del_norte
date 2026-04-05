import Link from "next/link";
import Image from "next/image";
import Pendiente from "@/public/images/Pendiente.png";

export default function PendienteAprobacionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-hueso">
      <div className="bg-white rounded-xl p-8 w-full max-w-md border border-gray-100 shadow-sm text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "#F4DEB3" }}
        >
          <Image
            src={Pendiente}
            alt="Pendiente por aprobación"
            width={55}
            height={55}
          />
        </div>
        <h1 className="text-xl font-bold text-verde mb-2">Solicitud enviada</h1>
        <p className="text-sm text-verde font-medium mb-6">
          Tu cuenta está pendiente de verificación
        </p>
        <div className="inline-flex items-center gap-2 text-amarillo text-xs px-4 py-2 rounded-full mb-6  bg-verde">
          <div className="w-2 h-2 rounded-full bg-amarillo"></div>
          Pendiente de aprobación
        </div>
        <div className="bg-hueso rounded-md p-4 text-left mb-6 border border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed">
            Nuestro equipo revisará tu información y te notificará por correo en{" "}
            <strong className="text-verde">máximo 48 horas hábiles</strong>.
            Mientras tanto puedes navegar el catálogo con precios de vitrina.
          </p>
        </div>

        <Link
          href="/catalogo"
          className="block w-full py-2.5 rounded-md text-sm font-medium bg-verde text-amarillo hover:opacity-90 transition-opacity"
        >
          Ir al catálogo
        </Link>
        <div className="mt-4">
          <Link href="/login" className="text-xs text-amarillo">
            ← Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
