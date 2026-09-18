"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ItemCarrito, Producto } from "@/types/producto";

interface CarritoContextType {
  carrito: ItemCarrito[];
  totalProductos: number;
  totalCosto: number;
  vaciarCarrito: () => void;
  agregarProducto: (producto: Producto) => void;
  aumentarCantidad: (id: number) => void;
  disminuirCantidad: (id: number) => void;
  eliminarProducto: (id: number) => void;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  function agregarProducto(producto: Producto) {
    // La versión funcional usa el estado más reciente, incluso con clics seguidos.
    setCarrito((actual) => {
      const existente = actual.find((item) => item.producto.id === producto.id);
      if ((existente?.quantity ?? 0) >= producto.stock) return actual;

      if (existente) {
        return actual.map((item) =>
          item.producto.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...actual, { producto, quantity: 1 }];
    });
  }

  function aumentarCantidad(id: number) {
    setCarrito((actual) => actual.map((item) =>
      item.producto.id === id && item.quantity < item.producto.stock
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    ));
  }

  function disminuirCantidad(id: number) {
    setCarrito((actual) => {
      // Primero resto una unidad al producto seleccionado.
      const actualizado = actual.map((item) =>
        item.producto.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      // Despues quito los productos que quedaron sin unidades.
      return actualizado.filter((item) => item.quantity > 0);
    });
  }

  function eliminarProducto(id: number) {
    setCarrito((actual) => actual.filter((item) => item.producto.id !== id));
  }

  // Se cuentan unidades, no solamente productos diferentes.
  const totalProductos = carrito.reduce((total, item) => total + item.quantity, 0);

  const totalCosto = carrito.reduce(
    (total, item) => total + Math.round(item.producto.price * 100) * item.quantity, 0,
  ) / 100;

  function vaciarCarrito() {
    setCarrito([]);
  }

  return (
    <CarritoContext.Provider value={{ carrito, totalProductos, totalCosto, agregarProducto, vaciarCarrito, aumentarCantidad, disminuirCantidad, eliminarProducto }}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return contexto;
}
