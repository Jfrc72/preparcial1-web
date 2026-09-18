import type { Producto } from "@/types/producto";

interface BotonAgregarProps {
  producto: Producto;
  cantidad: number;
  onAgregar: (producto: Producto) => void;
}

export default function BotonAgregar({ producto, cantidad, onAgregar }: BotonAgregarProps) {
  const agotado = producto.stock <= 0;
  const limite = cantidad >= producto.stock;

  return (
    <div className="accion-agregar">
      <button className="boton principal" disabled={agotado || limite} onClick={() => onAgregar(producto)}>
        {agotado ? "Sin stock" : limite ? "Límite de stock alcanzado" : "Agregar al carrito"}
      </button>
      <p className="cantidad-carrito">{cantidad > 0 ? `${cantidad} en tu carrito` : "Disponible para agregar"}</p>
    </div>
  );
}
