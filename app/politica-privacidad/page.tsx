import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad y tratamiento de datos personales de La Llave del Norte.",
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar breadcrumb={[
        { label: "Inicio", href: "/" },
        { label: "Política de privacidad" }
      ]}/>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-verde mb-2">Política de Privacidad</h1>
        <p className="text-sm text-gray-400 mb-8">Última actualización: mayo de 2025</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">1. Responsable del tratamiento</h2>
            <p>La Llave del Norte, con domicilio en Calle 65 #14-24, Bogotá, Colombia, es responsable del tratamiento de los datos personales que usted nos proporcione a través de nuestro sitio web <span className="text-verde">www.lallavedelnorte.com</span>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">2. Datos que recopilamos</h2>
            <p className="mb-2">Recopilamos los siguientes datos personales:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nombre y apellidos</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección de entrega</li>
              <li>Información de empresa y NIT (para clientes mayoristas)</li>
              <li>Datos de navegación y cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">3. Finalidad del tratamiento</h2>
            <p className="mb-2">Sus datos personales son utilizados para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestionar y procesar sus pedidos y compras</li>
              <li>Enviarle información sobre nuestros productos y promociones (si se suscribió)</li>
              <li>Gestionar su cuenta de usuario</li>
              <li>Coordinar el envío y entrega de productos</li>
              <li>Cumplir con obligaciones legales y contables</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">4. Base legal</h2>
            <p>El tratamiento de sus datos se realiza conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia, que regulan la protección de datos personales. Al usar nuestro sitio web y proporcionar sus datos, usted otorga su consentimiento para el tratamiento descrito en esta política.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">5. Compartición de datos</h2>
            <p className="mb-2">Sus datos pueden ser compartidos con:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Melonn</span> — para gestión de envíos y logística</li>
              <li><span className="font-medium">Bold</span> — para procesamiento de pagos</li>
              <li><span className="font-medium">Resend</span> — para envío de correos electrónicos</li>
            </ul>
            <p className="mt-2">No vendemos ni cedemos sus datos a terceros con fines comerciales.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">6. Cookies</h2>
            <p>Nuestro sitio utiliza cookies técnicas necesarias para el funcionamiento de la plataforma, como la gestión de sesiones y el carrito de compras. No utilizamos cookies de seguimiento publicitario de terceros.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">7. Sus derechos</h2>
            <p className="mb-2">Como titular de sus datos personales, usted tiene derecho a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conocer, actualizar y rectificar sus datos</li>
              <li>Solicitar la supresión de sus datos</li>
              <li>Revocar la autorización otorgada</li>
              <li>Acceder gratuitamente a sus datos</li>
            </ul>
            <p className="mt-2">Para ejercer estos derechos escríbanos a <span className="text-verde font-medium">al.lallavedelnorte1@gmail.com</span></p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">8. Conservación de datos</h2>
            <p>Sus datos serán conservados durante el tiempo necesario para cumplir con las finalidades descritas y las obligaciones legales aplicables.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-verde mb-3">9. Cambios en esta política</h2>
            <p>Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Los cambios serán publicados en esta página con la fecha de actualización.</p>
          </section>

          <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-verde mb-3">10. Contacto</h2>
            <p className="mb-2">Si tiene preguntas sobre esta política de privacidad:</p>
            <div className="space-y-1">
              <p>📧 al.lallavedelnorte1@gmail.com</p>
              <p>📍 Calle 65 #14-24, Bogotá, Colombia</p>
              <p>📞 3134866451</p>
            </div>
          </section>

        </div>
      </div>

      <Footer/>
    </div>
  )
}