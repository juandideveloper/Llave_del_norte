"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { div } from "framer-motion/client";

const productos = [
  {
    id: 1,
    nombre: "Lavaplatos Inteligente",
    categoria: "Lavaplatos",
    precioNormal: 599999,
    precioEspecial: 499999,
    stock: true,
    material: "Acero inoxidable",
    badge: "Precio especial",
    estrellas: 5,
    resenas: 12,
  },
  {
    id: 2,
    nombre: "Grifería Milano Negra",
    categoria: "Grifería",
    precioNormal: 399999,
    precioEspecial: 299999,
    stock: true,
    material: "Latón",
    badge: null,
    estrellas: 4,
    resenas: 8,
  },
  {
    id: 3,
    nombre: "Ducha Corona Pro",
    categoria: "Duchas",
    precioNormal: 299999,
    precioEspecial: 199999,
    stock: true,
    material: "Acero inoxidable",
    badge: "Precio especial",
    estrellas: 5,
    resenas: 20,
  },
  {
    id: 4,
    nombre: "Válvula Premium",
    categoria: "Válvulas",
    precioNormal: 199999,
    precioEspecial: 149999,
    stock: false,
    material: "Bronce",
    badge: null,
    estrellas: 3,
    resenas: 5,
  },
  {
    id: 5,
    nombre: "Lavaplatos Doble",
    categoria: "Lavaplatos",
    precioNormal: 799999,
    precioEspecial: 649999,
    stock: true,
    material: "Acero inoxidable",
    badge: "Precio especial",
    estrellas: 5,
    resenas: 15,
  },
  {
    id: 6,
    nombre: "Grifería Extensible",
    categoria: "Grifería",
    precioNormal: 349999,
    precioEspecial: 279999,
    stock: true,
    material: "Latón",
    badge: null,
    estrellas: 4,
    resenas: 9,
  },
  {
    id: 7,
    nombre: "Tornillería Set Pro",
    categoria: "Tornillería",
    precioNormal: 89999,
    precioEspecial: 69999,
    stock: true,
    material: "PVC",
    badge: null,
    estrellas: 4,
    resenas: 3,
  },
  {
    id: 8,
    nombre: "Ducha Filtro Carbón",
    categoria: "Duchas",
    precioNormal: 249999,
    precioEspecial: 189999,
    stock: false,
    material: "Acero inoxidable",
    badge: "Precio especial",
    estrellas: 5,
    resenas: 18,
  },
  {
    id: 9,
    nombre: "Grifería Sensor",
    categoria: "Grifería",
    precioNormal: 599999,
    precioEspecial: 479999,
    stock: true,
    material: "Acero inoxidable",
    badge: null,
    estrellas: 5,
    resenas: 7,
  },
];

const recomendados = [
  {
    id: 1,
    nombre: "Sanitario Una Pieza Granada Doble Descarga Blanco Semi Dacqua",
    categoria: "Baño",
    precio: 599999,
    estrellas: 5,
    resenas: 22,
  },
  {
    id: 2,
    nombre: "Grifería Lavaplatos Vero Extensible Negro Semi Dacqua",
    categoria: "Cocina",
    precio: 599999,
    estrellas: 5,
    resenas: 14,
  },
  {
    id: 3,
    nombre: "Grifería Ducha Monocontrol Canasta Pro Cromada Corona",
    categoria: "Duchas",
    precio: 599999,
    estrellas: 4,
    resenas: 11,
  },
  {
    id: 4,
    nombre: "Lavamanos Cerámico Doble Semi Dacqua",
    categoria: "Baño",
    precio: 599999,
    estrellas: 4,
    resenas: 6,
  },
];

const categorias = [
  { nombre: "Todos los productos", cantidad: 144 },
  { nombre: "Grifería", cantidad: 32 },
  { nombre: "Lavaplatos", cantidad: 18 },
  { nombre: "Duchas", cantidad: 34 },
  { nombre: "Válvulas", cantidad: 40 },
  { nombre: "Tornillería", cantidad: 20 },
];

const materiales = ["Acero inoxidable", "laton", "bronce", "PVC"];

function formatPrecio(precio: number) {
  return `$ ${precio.toLocaleString("es-CO")} und`;
}

function Estrellas({ cantidad }: { cantidad: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-sm ${i <= cantidad ? "text-amarillo" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CatalogoPage() {
  const { data: session } = useSession();
  const esEspecial =
    session?.user?.role === "ESPECIAL" && session?.user?.estado === "APROBADO";

  const [categoriaActiva, setCategoriaActiva] = useState("Todos los productos");
  const [materialesActivos, setMaterialesActivos] = useState<string[]>([]);
  const [soloEnStock, setSoloEnStock] = useState(false);
  const [sliderActual, setSliderActual] = useState(0);
  const [precioMax, setPrecioMax] = useState(500000);

  const productosFiltrados = productos.filter((p) => {
    if (
      categoriaActiva !== "Todos los productos" &&
      p.categoria !== categoriaActiva
    )
      return false;
    if (soloEnStock && !p.stock) return false;
    if (materialesActivos.length > 0 && !materialesActivos.includes(p.material))
      return false;
    const precio = esEspecial ? p.precioEspecial : p.precioNormal;
    if (precio > precioMax) return false;
    return true;
  });

  function toggleMaterial(material: string) {
    setMaterialesActivos((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material],
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="px-6 py-3 bg-verde-claro">
        <p className="text-sm text-gray-400">
          <Link href="/" className="hover:text-amarillo transition-colors">
            Inicio
          </Link>
          {"/"}
          <span className="text-amarillo font-medium pl-1">Catálogo</span>
        </p>
      </div>
      <div className="flex gap-6 px-4 md:px-6 py-6 max-w-7xl mx-auto">
        {/* Sidebar filtros */}
        <aside className="hidden md:block w-48 flex-shrink-0 space-y-6">
          {/* Categorías */}
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-400">
            <h3 className="text-sm font-medium text-verde mb-3">Categorias</h3>
            <div className="space-y-2">
              {categorias.map((cat) => (
                <label
                  key={cat.nombre}
                  className="flex items-center justify-between gap-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categoriaActiva === cat.nombre}
                      onChange={() => setCategoriaActiva(cat.nombre)}
                      className="accent-verde w-3.5 h-3.5"
                    />
                    <span
                      className={`text-xs transition-colors ${
                        categoriaActiva === cat.nombre
                          ? "text-verde font-medium"
                          : "text-gray-500 group-hover:text-verde"
                      }`}
                    >
                      {cat.nombre}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-400">
            <h3 className="text-sm font-medium text-verde mb-3">Precios</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 px-2 py-1.5 border border-gray-200 rounded-md">
                <p className="text-xs text-gray-500">$ 0</p>
              </div>
              <span className="text-gray-400 text-xs">-</span>
              <div className="flex-1 px-2 py-1.5 border border-gray-200 rounded-md">
                <p className="text-xs text-gray-500">
                  $ {precioMax.toLocaleString("es-CO")}
                </p>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={1000000}
              step={10000}
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="w-full accent-verde"
            />
          </div>

          {/* Disponibilidad */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-verde mb-3">
              Disponibilidad
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soloEnStock}
                  onChange={(e) => setSoloEnStock(e.target.checked)}
                  className="accent-verde w-3.5 h-3.5"
                />
                <span className="text-sm text-gray-500">En stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!soloEnStock}
                  onChange={(e) => setSoloEnStock(e.target.checked)}
                  className="accent-verde w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-500">En stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!soloEnStock}
                  onChange={(e) => setSoloEnStock(e.target.checked)}
                  className="accent-verde w-3.5 h-3.5"
                />
                <span className="text-xs text-gray-500">Bajo stock</span>
              </label>
            </div>
          </div>

          {/* Material */}
          <div>
            
          </div>
        </aside>
      </div>
    </div>
  );
}
