import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import WhatsAppFlotante from "@/components/ui/WhatsAppFlotante";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "La Llave del Norte | Ferretería y Grifería",
    template: "%s | La Llave del Norte",
  },
  description:
    "Importadores directos de ferretería, grifería, lavaplatos, duchas y accesorios de alta calidad. Precios mayoristas para arquitectos, constructoras y empresas en Colombia.",
  keywords: [
    "ferretería", "grifería", "lavaplatos", "duchas", "accesorios",
    "importadores directos", "precios mayoristas", "arquitectos",
    "constructoras", "acero inoxidable", "materiales construcción",
    "ferretería Colombia", "grifería Colombia", "Bogotá"
  ],
  authors: [{ name: "La Llave del Norte" }],
  creator: "La Llave del Norte",
  metadataBase: new URL("https://www.lallavedelnorte.com"),
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://www.lallavedelnorte.com",
    siteName: "La Llave del Norte",
    title: "La Llave del Norte | Ferretería y Grifería",
    description:
      "Importadores directos de ferretería, grifería, lavaplatos, duchas y accesorios de alta calidad. Precios mayoristas para arquitectos, constructoras y empresas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "La Llave del Norte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Llave del Norte | Ferretería y Grifería",
    description: "Importadores directos de ferretería y grifería de alta calidad.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <Providers>{children}</Providers>
        <WhatsAppFlotante/>
      </body>
    </html>
  );
}