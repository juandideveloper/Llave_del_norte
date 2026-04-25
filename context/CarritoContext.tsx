"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CarritoContextType {
  items: ItemCarrito[];
  agregarItem: (item: ItemCarrito) => void;
  eliminarItem: (id: number) => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
  hidratado: boolean;
  metodoEnvio: "envio" | "tienda";
  setMetodoEnvio: (metodo: "envio" | "tienda") => void;
}

const CarritoContext = createContext<CarritoContextType>({
  items: [],
  agregarItem: () => {},
  eliminarItem: () => {},
  actualizarCantidad: () => {},
  vaciarCarrito: () => {},
  totalItems: 0,
  totalPrecio: 0,
  hidratado: false,
  metodoEnvio: "envio",
  setMetodoEnvio: () => {},
});

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [hidratado, setHidratado] = useState(false);
  const [metodoEnvio, setMetodoEnvio] = useState<"envio" | "tienda">("envio");

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("carrito");
      const parsed: ItemCarrito[] = guardado ? JSON.parse(guardado) : [];
      setItems(parsed);
    } catch {
      setItems([]);
    } finally {
      setHidratado(true);
    }
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items, hidratado]);

  const agregarItem = useCallback((nuevoItem: ItemCarrito) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.id === nuevoItem.id);
      if (existe) {
        return prev.map((i) =>
          i.id === nuevoItem.id
            ? { ...i, cantidad: i.cantidad + nuevoItem.cantidad }
            : i,
        );
      }
      return [...prev, nuevoItem];
    });
  }, []);

  const eliminarItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const actualizarCantidad = useCallback((id: number, cantidad: number) => {
    if (cantidad <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad } : i)));
  }, []);

  const vaciarCarrito = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems: number = items.reduce(
    (acc: number, i: ItemCarrito) => acc + i.cantidad,
    0,
  );

  const totalPrecio: number = items.reduce(
    (acc: number, i: ItemCarrito) => acc + i.precio * i.cantidad,
    0,
  );

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarItem,
        eliminarItem,
        actualizarCantidad,
        vaciarCarrito,
        totalItems,
        totalPrecio,
        hidratado,
        metodoEnvio,
        setMetodoEnvio,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}