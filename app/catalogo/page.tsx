"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/ui/Footer";

interface ProductoAlegra {
  id: string;
  name: string;
  price: { price: number }[];
  inventory: { availableQuantity: number };
  description: string | null;
  status: string;
  category?: { name: string };
}

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

const materiales = ["Acero inoxidable", "Latón", "Bronce", "PVC"];

function formatPrecio(precio: number) {
  return `$ ${precio.toLocaleString("es-CO")} und`;
}

function Estrellas({ cantidad }: { cantidad: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-xs ${i <= cantidad ? "text-amarillo" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function BadgePrecioEspecial() {
  return (
    <div className="bg-amarillo-oscuro px-3 py-1.5 flex items-center gap-1.5 w-44 mt-3 rounded-r-md">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.1749 22C10.9249 22 10.6749 21.95 10.4249 21.85C10.1749 21.75 9.9499 21.6 9.7499 21.4L2.5999 14.25C2.3999 14.05 2.25407 13.8292 2.1624 13.5875C2.07074 13.3458 2.0249 13.1 2.0249 12.85C2.0249 12.6 2.07074 12.35 2.1624 12.1C2.25407 11.85 2.3999 11.625 2.5999 11.425L11.3999 2.6C11.5832 2.41667 11.7999 2.27083 12.0499 2.1625C12.2999 2.05417 12.5582 2 12.8249 2H19.9999C20.5499 2 21.0207 2.19583 21.4124 2.5875C21.8041 2.97917 21.9999 3.45 21.9999 4V11.175C21.9999 11.4417 21.9499 11.6958 21.8499 11.9375C21.7499 12.1792 21.6082 12.3917 21.4249 12.575L12.5999 21.4C12.3999 21.6 12.1749 21.75 11.9249 21.85C11.6749 21.95 11.4249 22 11.1749 22ZM17.4999 8C17.9166 8 18.2707 7.85417 18.5624 7.5625C18.8541 7.27083 18.9999 6.91667 18.9999 6.5C18.9999 6.08333 18.8541 5.72917 18.5624 5.4375C18.2707 5.14583 17.9166 5 17.4999 5C17.0832 5 16.7291 5.14583 16.4374 5.4375C16.1457 5.72917 15.9999 6.08333 15.9999 6.5C15.9999 6.91667 16.1457 7.27083 16.4374 7.5625C16.7291 7.85417 17.0832 8 17.4999 8Z"
          fill="white"
        />
      </svg>
      <p className="text-xs font-extrabold text-white">PRECIO ESPECIAL</p>
    </div>
  );
}

interface SidebarFiltrosProps {
  categoriaActiva: string;
  setCategoriaActiva: (cat: string) => void;
  precioMin: number;
  setPrecioMin: (precio: number) => void;
  precioMax: number;
  setPrecioMax: (precio: number) => void;
  soloEnStock: boolean;
  setSoloEnStock: (valor: boolean) => void;
  materialesActivos: string[];
  toggleMaterial: (material: string) => void;
  categorias: { nombre: string; cantidad: number }[];
}

function SidebarFiltros({
  categoriaActiva,
  setCategoriaActiva,
  precioMax,
  setPrecioMax,
  precioMin,
  setPrecioMin,
  soloEnStock,
  setSoloEnStock,
  materialesActivos,
  toggleMaterial,
  categorias,
}: SidebarFiltrosProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-xl p-4 border border-gray-400">
        <h3 className="text-sm font-medium text-verde mb-3">Categorías</h3>
        <div className="hidden lg:block w-44 h-px bg-gray-400 mb-2" />
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
                  className="accent-verde w-3.5 h-3.5 cursor-pointer"
                />
                <span
                  className={`text-xs transition-colors ${categoriaActiva === cat.nombre ? "text-verde font-medium" : "text-gray-500 group-hover:text-verde"}`}
                >
                  {cat.nombre}
                </span>
              </div>
              <span className="text-xs text-gray-400">{cat.cantidad}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 border border-gray-400">
        <h3 className="text-sm font-medium text-verde mb-3">Precio</h3>
        <div className="hidden lg:block w-44 h-px bg-gray-400 mb-2" />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Mínimo</p>
            <input
              type="text"
              placeholder="$ 0"
              value={
                precioMin === 0 ? "" : `$ ${precioMin.toLocaleString("es-CO")}`
              }
              onChange={(e) => {
                const valor = e.target.value.replace(/[^0-9]/g, "");
                setPrecioMin(Number(valor));
              }}
              className="w-full px-2 py-1.5 border border-gray-400 rounded-md text-xs text-gray-600 outline-none focus:border-verde bg-white"
            />
          </div>
          <span className="text-gray-400 text-xs mt-4">—</span>
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Máximo</p>
            <input
              type="text"
              placeholder="$ 1.000.000"
              value={
                precioMax === 1000000
                  ? ""
                  : `$ ${precioMax.toLocaleString("es-CO")}`
              }
              onChange={(e) => {
                const valor = e.target.value.replace(/[^0-9]/g, "");
                setPrecioMax(Number(valor) || 1000000);
              }}
              className="w-full px-2 py-1.5 border border-gray-400 rounded-md text-xs text-gray-600 outline-none focus:border-verde bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 border border-gray-400">
        <h3 className="text-sm font-medium text-verde mb-3">Disponibilidad</h3>
        <div className="hidden lg:block w-44 h-px bg-gray-400 mb-2" />
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={soloEnStock}
              onChange={(e) => setSoloEnStock(e.target.checked)}
              className="accent-verde w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-xs text-gray-500">En stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!soloEnStock}
              onChange={(e) => setSoloEnStock(!e.target.checked)}
              className="accent-verde w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-xs text-gray-500">Bajo stock</span>
          </label>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 border border-gray-400">
        <h3 className="text-sm font-medium text-verde mb-3">Material</h3>
        <div className="hidden lg:block w-44 h-px bg-gray-400 mb-2" />
        <div className="space-y-2">
          {materiales.map((mat) => (
            <label
              key={mat}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={materialesActivos.includes(mat)}
                onChange={() => toggleMaterial(mat)}
                className="accent-verde w-3.5 h-3.5 cursor-pointer"
              />
              <span
                className={`text-xs transition-colors ${materialesActivos.includes(mat) ? "text-verde font-medium" : "text-gray-500 group-hover:text-verde"}`}
              >
                {mat}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

const PRODUCTOS_POR_PAGINA = 6;

export default function CatalogoPage() {
  const { data: session } = useSession();
  const esEspecial =
    session?.user?.role === "ESPECIAL" && session?.user?.estado === "APROBADO";

  const [productosAlegra, setProductosAlegra] = useState<ProductoAlegra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos los productos");
  const [materialesActivos, setMaterialesActivos] = useState<string[]>([]);
  const [soloEnStock, setSoloEnStock] = useState(false);
  const [sliderActual, setSliderActual] = useState(0);
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(1000000);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        if (data.productos) {
          setProductosAlegra(
            data.productos.filter((p: ProductoAlegra) => p.status === "active"),
          );
        }
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  // Generar categorías dinámicas desde Alegra
  const categoriasUnicas = [
    "Todos los productos",
    ...new Set(productosAlegra.map((p) => p.category?.name || "General")),
  ];
  const categorias = categoriasUnicas.map((nombre) => ({
    nombre,
    cantidad:
      nombre === "Todos los productos"
        ? productosAlegra.length
        : productosAlegra.filter(
            (p) => (p.category?.name || "General") === nombre,
          ).length,
  }));

  const productosFiltrados = productosAlegra.filter((p) => {
    if (
      categoriaActiva !== "Todos los productos" &&
      (p.category?.name || "General") !== categoriaActiva
    )
      return false;
    if (soloEnStock && p.inventory?.availableQuantity <= 0) return false;
    if (!soloEnStock && p.inventory?.availableQuantity > 0) return false;
    const precio = p.price[0]?.price || 0;
    if (precio > precioMax) return false;
    if (precioMin > 0 && precio < precioMin) return false;
    return true;
  });

  const totalPaginas = Math.ceil(
    productosFiltrados.length / PRODUCTOS_POR_PAGINA,
  );
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    paginaActual * PRODUCTOS_POR_PAGINA,
  );

  function toggleMaterial(material: string) {
    setMaterialesActivos((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material],
    );
    setPaginaActual(1);
  }

  function handleCategoria(cat: string) {
    setCategoriaActiva(cat);
    setPaginaActual(1);
  }

  const filtrosProps: SidebarFiltrosProps = {
    categoriaActiva,
    setCategoriaActiva: handleCategoria,
    precioMin,
    setPrecioMin,
    precioMax,
    setPrecioMax,
    soloEnStock,
    setSoloEnStock,
    materialesActivos,
    toggleMaterial,
    categorias,
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        breadcrumb={[{ label: "Inicio", href: "/" }, { label: "Catalogo" }]}
      />

      {/* Botón filtros móvil */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          className="flex items-center gap-2 text-sm font-medium text-verde border border-verde rounded-lg px-4 py-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          Filtros
          {(materialesActivos.length > 0 ||
            soloEnStock ||
            categoriaActiva !== "Todos los productos") && (
            <span className="bg-verde text-amarillo text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {materialesActivos.length +
                (soloEnStock ? 1 : 0) +
                (categoriaActiva !== "Todos los productos" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Filtros móvil desplegables */}
      <AnimatePresence>
        {filtrosAbiertos && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-gray-50 px-4 py-4 border-b border-gray-100"
          >
            <SidebarFiltros {...filtrosProps} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6 px-4 md:px-6 py-6 max-w-7xl mx-auto">
        {/* Sidebar filtros desktop */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <SidebarFiltros {...filtrosProps} />
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Slider Recomendados */}
          <div className="bg-[linear-gradient(to_bottom,#112221,#005752,#80A8A6,#E4E4E4)] rounded-xl p-4 md:p-6">
            <h2 className="text-center text-xs font-medium text-hueso/60 uppercase tracking-widest mb-4">
              Recomendados
            </h2>
            <div className="relative px-8">
              <div className="overflow-hidden">
                <motion.div
                  className="flex gap-3"
                  animate={{
                    x: `-${sliderActual * (100 / recomendados.length)}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {recomendados.map((prod) => (
                    <div
                      key={prod.id}
                      className="min-w-[calc(50%-6px)] md:min-w-[calc(25%-9px)] bg-white rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    >
                      <div className="h-32 md:h-36 bg-gray-50 flex items-center justify-center">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.8"
                          className="text-verde/20"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                      </div>
                      <div className="p-2 md:p-3">
                        <Estrellas cantidad={prod.estrellas} />
                        <p className="text-xs text-gray-400">
                          ({prod.resenas})
                        </p>
                        <p className="text-xs font-medium text-verde mt-1 leading-tight line-clamp-2">
                          {prod.nombre}
                        </p>
                        <p className="text-xs font-medium text-verde mt-1">
                          {formatPrecio(prod.precio)}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              <button
                onClick={() =>
                  setSliderActual(
                    sliderActual === 0
                      ? recomendados.length - 1
                      : sliderActual - 1,
                  )
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md z-10 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 69 69" fill="none">
                  <path
                    d="M28.75 63.25L0 34.5L28.75 5.75002L33.8531 10.8531L10.2063 34.5L33.8531 58.1469L28.75 63.25Z"
                    fill="#112221"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setSliderActual(
                    sliderActual === recomendados.length - 1
                      ? 0
                      : sliderActual + 1,
                  )
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md z-10 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 69 69" fill="none">
                  <path
                    d="M40.25 5.75L69 34.5L40.25 63.25L35.1469 58.1469L58.7938 34.5L35.1469 10.8531L40.25 5.75Z"
                    fill="#112221"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h2 className="text-xl font-semibold text-verde/46 uppercase tracking-widest text-center mb-4">
              {categoriaActiva}
            </h2>

            {cargando ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-verde border-t-transparent animate-spin" />
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">
                  No hay productos con estos filtros
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {productosPaginados.map((producto) => {
                    const precio = producto.price[0]?.price || 0;
                    const precioEspecial = Math.round(precio * 0.85);
                    const enStock =
                      (producto.inventory?.availableQuantity || 0) > 0;

                    return (
                      <motion.div
                        key={producto.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl overflow-hidden border-1 border-amarillo"
                      >
                        <div className="relative h-36 md:h-44 bg-gray-50 flex items-center justify-center">
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.8"
                            className="text-verde/20"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 21V9" />
                          </svg>
                          {esEspecial && (
                            <div className="absolute top-0 left-0">
                              <BadgePrecioEspecial />
                            </div>
                          )}
                          {!enStock && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Agotado
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <p className="text-sm font-medium text-verde mt-1 leading-tight">
                            {producto.name}
                          </p>
                          {esEspecial ? (
                            <div className="mt-2">
                              <p className="text-xs text-gray-400 line-through">
                                $ {Math.round(precio).toLocaleString("es-CO")}{" "}
                                und
                              </p>
                              <p className="text-sm font-semibold text-verde">
                                $ {precioEspecial.toLocaleString("es-CO")} und
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Este precio se mantiene ya que eres mayorista
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-verde mt-2">
                              $ {Math.round(precio).toLocaleString("es-CO")} und
                            </p>
                          )}
                          <Link
                            href={`/catalogo/${producto.id}`}
                            className="block w-full mt-3 py-2.5 bg-verde text-hueso text-xs font-bold text-center rounded-lg hover:opacity-90 transition-opacity uppercase tracking-wider"
                          >
                            Detalles
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                      disabled={paginaActual === 1}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-sm text-gray-500 hover:border-verde hover:text-verde transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                      (pagina) => {
                        const mostrar =
                          pagina === 1 ||
                          pagina === totalPaginas ||
                          Math.abs(pagina - paginaActual) <= 1;
                        if (!mostrar) {
                          const anteriorMostrada =
                            pagina - 1 === 1 ||
                            pagina - 1 === totalPaginas ||
                            Math.abs(pagina - 1 - paginaActual) <= 1;
                          if (!anteriorMostrada) return null;
                          return (
                            <span
                              key={pagina}
                              className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
                            >
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={pagina}
                            onClick={() => setPaginaActual(pagina)}
                            className={`w-9 h-9 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                              paginaActual === pagina
                                ? "bg-verde text-amarillo border-verde"
                                : "border-gray-200 text-gray-600 hover:border-verde hover:text-verde"
                            }`}
                          >
                            {pagina}
                          </button>
                        );
                      },
                    )}
                    <button
                      onClick={() =>
                        setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                      }
                      disabled={paginaActual === totalPaginas}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-sm text-gray-500 hover:border-verde hover:text-verde transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
