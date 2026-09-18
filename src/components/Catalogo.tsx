"use client";

import { useEffect, useState } from "react";
import { useCarrito } from "@/context/CarritoContext";
import { obtenerProductos } from "@/lib/productos";
import type { Producto } from "@/types/producto";
import TarjetaProducto from "./TarjetaProducto";
import MensajeError from "./MensajeError";

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);
  const { carrito, agregarProducto } = useCarrito();

  useEffect(() => {
    const controlador = new AbortController();
    async function cargar() {
      try {
        const datos = await obtenerProductos(controlador.signal);
        setProductos(datos.products);
      } catch (error) {
        if (!controlador.signal.aborted) {
          setError(error instanceof TypeError ? "Revisa tu conexión a internet e intenta de nuevo." : error instanceof Error ? error.message : "Ocurrió un error al cargar los productos.");
        }
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }
    cargar();
    // Cancela la petición si salimos de esta vista antes de que termine.
    return () => controlador.abort();
  }, [intento]);

  function reintentar() {
    setError("");
    setCargando(true);
    setIntento((actual) => actual + 1);
  }

  return (
    <section aria-labelledby="titulo-catalogo">
      <div className="titulo-seccion">
        <div><h2 id="titulo-catalogo">Nuestro catálogo</h2><p>Un vistazo a lo que tenemos para ti.</p></div>
        {!cargando && !error && <span className="numero-productos">{productos.length} productos</span>}
      </div>
      {cargando ? <p className="estado" role="status">Cargando productos…</p>
        : error ? <MensajeError mensaje={error} onReintentar={reintentar} />
        : productos.length === 0 ? <p className="estado">No hay productos disponibles por ahora.</p>
        : <div className="cuadricula">
          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto}
              cantidad={carrito.find((item) => item.producto.id === producto.id)?.quantity ?? 0}
              onAgregar={agregarProducto} />
          ))}
        </div>}
    </section>
  );
}
