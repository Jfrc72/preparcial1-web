import Image from "next/image";
import Link from "next/link";
import BotonAgregar from "./BotonAgregar";
import { formatearPrecio } from "@/lib/productos";
import type { Producto } from "@/types/producto";

interface TarjetaProductoProps {
  producto: Producto;
  cantidad: number;
  onAgregar: (producto: Producto) => void;
}

export default function TarjetaProducto({ producto, cantidad, onAgregar }: TarjetaProductoProps) {
  return (
    <article className="tarjeta">
      <div className="foto-tarjeta">
        <Image src={producto.thumbnail} alt={producto.title} width={260} height={220} unoptimized loading="eager" />
      </div>
      <div className="contenido-tarjeta">
        <p className="categoria">{producto.category}</p>
        <h3>{producto.title}</h3>
        <p className="precio">{formatearPrecio(producto.price)}</p>
        <p className="stock">{producto.stock > 0 ? `${producto.stock} unidades en stock` : "Producto agotado"}</p>
        <Link className="enlace-detalle" href={`/productos/${producto.id}`} aria-label={`Ver detalle de ${producto.title}`}>Ver detalle <span aria-hidden="true">→</span></Link>
        <BotonAgregar producto={producto} cantidad={cantidad} onAgregar={onAgregar} />
      </div>
    </article>
  );
}
