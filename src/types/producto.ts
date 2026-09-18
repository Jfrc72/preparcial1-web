export interface Producto {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  stock: number;
}

export interface DetalleProducto extends Producto {
  description: string;
  images: string[];
  brand?: string;
}

export interface RespuestaProductos {
  products: Producto[];
  total: number;
  skip: number;
  limit: number;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
