"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface ModalCarritoProps {
  visible: boolean
  onCerrar: () => void
}

export default function ModalCarrito({ visible, onCerrar }: ModalCarritoProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onCerrar}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-verde rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center"
          >
            {/* Ícono check */}
            <div className="w-16 h-16 rounded-full border-4 border-amarillo flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="#e1b86b" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>

            <p className="text-base font-medium text-amarillo mb-6">
              ¡Producto agregado al carro!
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={onCerrar}
                className="w-full py-2.5 border border-gray-50 text-amarillo text-sm font-medium rounded-lg hover:bg-gray-50 hover:text-verde transition-colors cursor-pointer"
              >
                Continuar comprando
              </button>
              <Link href="/carrito"
                className="w-full py-2.5 bg-amarillo text-hueso text-sm font-medium rounded-lg hover:opacity-90 transition-opacity text-center"
              >
                Ir al carro de compras
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}