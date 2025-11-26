import Image from "next/image"

export default async function Page() {

  const API = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("API:", API);

  const response = await fetch(`${API}/productos`)

  const productos = await response.json()

  console.log(productos)


  return <div>
    <h1>Productos</h1>

    <div className="grid grid-cols-3 gap-4 p-20 container mx-auto">
    {productos.map((producto:any) => (
      <div className="bg-white p-5 text-black" key={producto.id}>
        <h1>{producto.nombre}</h1>
        <h3>{producto.precio}</h3>
        <p>{producto.descripcion}</p>
        <img src={producto.imagenURL} alt="" width={200} height={200}/>


      </div>
    ))
    
  }
  </div>
  </div>
}