"use client"

import { SessionProvider } from "next-auth/react"
import { CarritoProvider } from "@/context/CarritoContext"
import { usePathname } from "next/navigation"
import { AnimatePresence } from "framer-motion"

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SessionProvider>
      <CarritoProvider>
        <AnimatePresence mode="wait" initial={false}>
          <div key={pathname}>
            {children}
          </div>
        </AnimatePresence>
      </CarritoProvider>
    </SessionProvider>
  )
}
