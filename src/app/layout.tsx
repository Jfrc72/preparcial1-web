import type { Metadata } from "next";
import Header from "@/components/Header";
import { CarritoProvider } from "@/context/CarritoContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopHub | Catálogo",
  description: "Catálogo de productos y carrito de compras de ShopHub.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="saltar-contenido" href="#contenido">Saltar al contenido</a>
        {/* El proveedor permanece montado cuando cambia la página. */}
        <CarritoProvider>
          <Header />
          <main id="contenido" className="contenedor">{children}</main>
        </CarritoProvider>
        <footer className="contenedor pie">
          <span>ShopHub · Programación con Tecnologías Web</span>
          <span>Proyecto académico · Sin compras reales</span>
        </footer>
      </body>
    </html>
  );
}
