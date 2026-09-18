"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ItemCarrito, Producto } from "@/types/producto";

interface CarritoContextType {
  carrito: ItemCarrito[];
  totalProductos: number;
  agregarProducto: (producto: Producto) => void;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  function agregarProducto(producto: Producto) {
    // La versión funcional usa el estado más reciente, incluso con clics seguidos.
    setCarrito((actual) => {
      const existente = actual.find((item) => item.producto.id === producto.id);
      if ((existente?.cantidad ?? 0) >= producto.stock) return actual;

      if (existente) {
        return actual.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...actual, { producto, cantidad: 1 }];
    });
  }

  // Se cuentan unidades, no solamente productos diferentes.
  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ carrito, totalProductos, agregarProducto }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return contexto;
}
