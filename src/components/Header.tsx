"use client";

import Link from "next/link";
import { useCarrito } from "@/context/CarritoContext";

export default function Header() {
  const { totalProductos } = useCarrito();
  return (
    <header className="cabecera">
      <div className="contenedor barra">
        <Link className="marca" href="/" aria-label="ShopHub, inicio">Shop<span>Hub</span><span className="punto">.</span></Link>
        <nav aria-label="Navegación principal"><Link href="/">Catálogo</Link><Link href="/checkout">Checkout</Link></nav>
        <div className="indicador-carrito" role="status" aria-live="polite" aria-atomic="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 3h2l3 12h10l3-9H6M9 20h.01M18 20h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Carrito</span><strong>{totalProductos}</strong>
          <span className="solo-lector">unidades</span>
        </div>
      </div>
    </header>
  );
}
