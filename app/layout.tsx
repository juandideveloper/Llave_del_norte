import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "La Llave del Norte",
  description:
    "Importadores directos de ferretería, grifería, lavaplatos, duchas y accesorios de alta calidad. Precios mayoristas para arquitectos, constructoras y empresas.",
  keywords:
    "ferretería, grifería, lavaplatos, duchas, accesorios, importadores directos, precios mayoristas, arquitectos, constructoras, empresas, acero inoxidable, materiales construcción, acabados",
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
      </body>
    </html>
  );
}
