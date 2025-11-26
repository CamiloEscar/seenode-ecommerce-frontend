"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function Page() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/productos`);
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1>Productos</h1>

      <div className="grid grid-cols-3 gap-4 p-20 container mx-auto">
        {productos.map((producto: any) => (
          <div className="bg-white p-5 text-black" key={producto.id}>
            <h1>{producto.nombre}</h1>
            <h3>{producto.precio}</h3>
            <p>{producto.descripcion}</p>
            <img src={producto.imagenURL} width={200} height={200} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
