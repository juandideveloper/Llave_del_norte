"use client";
import { SessionProvider } from "next-auth/react";

// Este componente envuelve toda la app para que cualquier
// página pueda saber si el usuario está logueado o no

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
