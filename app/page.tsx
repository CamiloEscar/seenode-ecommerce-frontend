"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  id: string | number;
  nombre?: string;
  descripcion?: string;
  precio?: number | string;
  imagenURL?: string;
  oferta?: boolean;
};

export const dynamic = "force-dynamic";

export default function Page() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/productos`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProductos(data);
      } catch (err: unknown) {
        console.error("Error cargando productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatPrice = (p?: number | string) => {
    const n = Number(p) || 0;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);
  };

  const filtered = productos.filter((prod: Product) =>
    `${prod.nombre ?? ""} ${prod.descripcion ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Productos</h1>
            <p className="mt-1 text-sm text-gray-600">Explora nuestra selección de artículos</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              aria-label="Buscar productos"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="w-64 px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">
              Filtrar
            </button>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg p-4 h-64" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((producto: Product) => (
              <article
                key={producto.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                aria-labelledby={`producto-${producto.id}-title`}
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={producto.imagenURL || "/placeholder.png"}
                    alt={producto.nombre || "Producto"}
                    height={200}
                    width={200}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {producto.oferta && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      Oferta
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h2 id={`producto-${producto.id}-title`} className="text-lg font-semibold text-gray-900 truncate">
                    {producto.nombre}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{producto.descripcion}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-indigo-600 font-bold text-lg">{formatPrice(producto.precio)}</div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">
                        Ver
                      </button>
                      <button className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
