import type { DetalleProducto, RespuestaProductos } from "@/types/producto";

const API = "https://dummyjson.com/products";

export async function obtenerProductos(signal: AbortSignal): Promise<RespuestaProductos> {
  const respuesta = await fetch(
    `${API}?limit=8&select=id,title,price,category,thumbnail,stock`,
    { signal },
  );
  if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo. Intenta de nuevo.");
  return respuesta.json();
}

export async function obtenerProducto(id: string, signal: AbortSignal): Promise<DetalleProducto> {
  const respuesta = await fetch(`${API}/${id}`, { signal });
  if (respuesta.status === 404) throw new Error("No encontramos ese producto. Vuelve al catálogo para elegir otro.");
  if (!respuesta.ok) throw new Error("No se pudo cargar el producto. Intenta de nuevo.");
  return respuesta.json();
}

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "USD", currencyDisplay: "code" }).format(precio);
}
