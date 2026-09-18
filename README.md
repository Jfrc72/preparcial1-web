## ShopHub

Proyecto del preparcial de Programación con Tecnologías Web, desarrollado con Next.js, React y TypeScript.

La aplicación consulta productos de DummyJSON y permite ver sus detalles y agregarlos a un carrito de compras.

Ejecutar el proyecto

npm install
npm run dev

Abrir http://localhost:3000 en el navegador. Se necesita conexión a internet para cargar los productos y sus imágenes.

## Organización

```text
src/
  app/
    layout.tsx                # Provider y header que permanecen entre rutas
    page.tsx                  # Inicio y catálogo
    productos/[id]/page.tsx    # Ruta dinámica
    loading.tsx               # Carga de una ruta
    not-found.tsx             # Página inexistente
    globals.css               # Diseño adaptable
  components/
    Catalogo.tsx               # Consulta y estado local de la lista
    TarjetaProducto.tsx        # Datos y callback recibidos por props
    DetalleProducto.tsx       # Consulta individual y estado local
    BotonAgregar.tsx           # Acción reutilizada y límite por stock
    Header.tsx                 # Contador compartido
    MensajeError.tsx           # Error y callback de reintento
  context/CarritoContext.tsx   # Arreglo global, cantidades y función de agregar
  types/producto.ts           # Interfaces
  lib/productos.ts            # Fetch y formato del precio
```

## Funcionalidades

- Catálogo de ocho productos con imagen, nombre, categoría, precio y stock.
- Página de detalle para cada producto.
- Carrito compartido mediante React Context.
- Contador de unidades en la barra superior.
- Mensajes de carga y error.
- Diseño adaptable a dispositivos móviles.

El carrito conserva su contenido al navegar entre páginas, pero se reinicia al recargar el navegador.

## API utilizada

DummyJSON.

## Decisiones de Arquitectura y Cambios del Parcial

1. Evolucion del contexto: En el preparcial el carrito ya guardaba productos con `cantidad`. Cambie ese campo a `quantity` y agregue las opciones de disminuir, eliminar y vaciar. Use el estado anterior con `map`, `filter` y copias con `...` para no modificar los datos originales. El carrito se mantiene en memoria al navegar, pero se pierde al recargar.

2. Calculo de totales: Use `reduce` para sumar precio por cantidad y contar las unidades. Hago la suma del dinero en centavos y al final divido entre 100 para evitar errores con decimales. Los totales se calculan en cada render y se comparten por el contexto, sin guardarlos en otro estado para no duplicar datos.

3. Arquitectura del formulario: Use React con TypeScript y campos HTML nativos, sin librerias extra. Controle los campos con `useState`, `value` y `onChange`, y los terminos con `checked`. Los errores aparecen despues de `onBlur` y el boton se habilita cuando todo es valido. Use `preventDefault` para evitar la recarga, `setTimeout` para simular la espera y `useRef` para bloquear envios repetidos. Al terminar se vacia el carrito, se reinicia el formulario y se muestra la confirmacion.