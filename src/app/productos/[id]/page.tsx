import { notFound } from "next/navigation";
import DetalleProducto from "@/components/DetalleProducto";

export default async function PaginaProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  // Al cambiar de id, el detalle inicia una nueva consulta; el carrito no se desmonta.
  return <DetalleProducto key={id} id={id} />;
}
