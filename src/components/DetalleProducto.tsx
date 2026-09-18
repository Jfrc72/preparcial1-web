"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCarrito } from "@/context/CarritoContext";
import { obtenerProducto, formatearPrecio } from "@/lib/productos";
import type { DetalleProducto as ProductoCompleto } from "@/types/producto";
import BotonAgregar from "./BotonAgregar";
import MensajeError from "./MensajeError";

export default function DetalleProducto({ id }: { id: string }) {
  const [producto, setProducto] = useState<ProductoCompleto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);
  const { carrito, agregarProducto } = useCarrito();

  useEffect(() => {
    const controlador = new AbortController();
    async function cargar() {
      try {
        const datos = await obtenerProducto(id, controlador.signal);
        setProducto(datos);
      } catch (error) {
        if (!controlador.signal.aborted) {
          setError(error instanceof TypeError ? "Revisa tu conexión a internet e intenta de nuevo." : error instanceof Error ? error.message : "Ocurrió un error al cargar el producto.");
        }
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }
    cargar();
    return () => controlador.abort();
  }, [id, intento]);

  function reintentar() {
    setError("");
    setCargando(true);
    setIntento((actual) => actual + 1);
  }

  const cantidad = carrito.find((item) => item.producto.id === producto?.id)?.cantidad ?? 0;

  return (
    <>
      <Link href="/" className="volver">← Volver al catálogo</Link>
      {cargando ? <p className="estado" role="status">Cargando producto…</p>
        : error ? <MensajeError mensaje={error} onReintentar={reintentar} />
        : producto && (
          <article className="detalle">
            <div className="foto-detalle">
              <Image src={producto.images[0] || producto.thumbnail} alt={producto.title} width={540} height={540} unoptimized loading="eager" />
            </div>
            <div className="informacion-detalle">
              <p className="categoria">{producto.category}</p>
              <h1>{producto.title}</h1>
              {producto.brand && <p className="marca-producto">Marca: {producto.brand}</p>}
              <p className="precio precio-detalle">{formatearPrecio(producto.price)}</p>
              <p className="stock">{producto.stock > 0 ? `${producto.stock} unidades en stock` : "Producto agotado"}</p>
              <div className="descripcion"><h2>Sobre este producto</h2><p>{producto.description}</p></div>
              <BotonAgregar producto={producto} cantidad={cantidad} onAgregar={agregarProducto} />
              <p className="nota">Puedes seguir explorando: tu selección se mantiene al cambiar de página.</p>
            </div>
          </article>
        )}
    </>
  );
}
