"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCarrito } from "@/context/CarritoContext";
import { formatearPrecio } from "@/lib/productos";

const inicial = { nombre: "", correo: "", metodo: "", terminos: false };
const sinInteraccion = { nombre: false, correo: false };

export default function Checkout() {
  const { carrito, totalCosto, vaciarCarrito, aumentarCantidad, disminuirCantidad, eliminarProducto } = useCarrito();
  const [formulario, setFormulario] = useState(inicial);
  const [visitados, setVisitados] = useState(sinInteraccion);
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);
  // Evita que dos clics seguidos inicien el mismo pedido.
  const bloqueo = useRef(false);
  const temporizador = useRef<number | null>(null);

  // Salir de la vista cancela la simulación y evita vaciar una compra posterior.
  useEffect(() => {
    return () => {
      if (temporizador.current !== null) {
        window.clearTimeout(temporizador.current);
      }
    };
  }, []);

  const nombreValido = formulario.nombre.trim().length >= 5;
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo);
  const metodoValido = ["tarjeta", "transferencia", "contraentrega"].includes(formulario.metodo);
  const puedeEnviar = nombreValido && correoValido && metodoValido
    && formulario.terminos && carrito.length > 0;

  function confirmar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!puedeEnviar || bloqueo.current) return;
    bloqueo.current = true;
    setEnviando(true);
    // Simulación académica: no se envían datos ni se realiza un cobro real.
    temporizador.current = window.setTimeout(() => {
      vaciarCarrito();
      setFormulario(inicial);
      setVisitados(sinInteraccion);
      setCompletado(true);
      setEnviando(false);
      bloqueo.current = false;
      temporizador.current = null;
    }, 1500);
  }

  return (
    <div className="pagina-checkout">
      <h1>Finalizar compra</h1>
      <div role="status" aria-live="polite">
        {completado && <div className="estado confirmacion"><h2>¡Pedido completado!</h2><p>Tu orden se ha confirmado y el carrito está vacío.</p><Link href="/">Volver al catálogo</Link></div>}
        {enviando && <p className="estado">Procesando tu pedido. Por favor, espera…</p>}
      </div>
      {!completado && carrito.length === 0 ? (
        <div className="estado"><p>Tu carrito está vacío. Agrega productos antes de confirmar una orden.</p><Link href="/">Explorar catálogo</Link></div>
      ) : !completado && (
        <div className="checkout">
          <section className="panel-checkout" aria-labelledby="resumen-compra">
            <h2 id="resumen-compra">Resumen de compra</h2>
            <ul className="resumen-compra">
              {carrito.map(({ producto, quantity }) => (
                <li key={producto.id}>
                  <h3>{producto.title}</h3>
                  <p>{quantity} unidades por {formatearPrecio(producto.price)}</p>
                  <div className="acciones-carrito">
                    <button type="button" disabled={enviando} onClick={() => disminuirCantidad(producto.id)} aria-label={`Disminuir cantidad de ${producto.title}`}>−</button>
                    <span>Cantidad: {quantity}</span>
                    <button type="button" disabled={enviando || quantity >= producto.stock} onClick={() => aumentarCantidad(producto.id)} aria-label={`Aumentar cantidad de ${producto.title}`}>+</button>
                    <button type="button" disabled={enviando} onClick={() => eliminarProducto(producto.id)} aria-label={`Eliminar ${producto.title}`}>Eliminar</button>
                  </div>
                  <strong>Subtotal: {formatearPrecio(Math.round(producto.price * 100) * quantity / 100)}</strong>
                </li>
              ))}
            </ul>
            <p className="total-compra">Total a pagar <strong>{formatearPrecio(totalCosto)}</strong></p>
            <button type="button" disabled={enviando} onClick={vaciarCarrito}>Vaciar carrito</button>
          </section>
          <form className="panel-checkout" onSubmit={confirmar} noValidate aria-busy={enviando}>
            <h2>Datos de facturación</h2>
            <fieldset disabled={enviando}>
              <legend className="solo-lector">Información del comprador</legend>
              <label htmlFor="nombre">Nombre completo</label>
              <input id="nombre" name="nombre" type="text" autoComplete="name" required minLength={5}
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                onBlur={() => setVisitados({ ...visitados, nombre: true })}
                aria-invalid={visitados.nombre && !nombreValido}
                aria-describedby={visitados.nombre && !nombreValido ? "error-nombre" : undefined} />
              {visitados.nombre && !nombreValido && <p className="error-campo" id="error-nombre">El nombre debe tener al menos 5 caracteres.</p>}

              <label htmlFor="correo">Correo de facturación</label>
              <input id="correo" name="correo" type="email" autoComplete="email" required
                value={formulario.correo}
                onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })}
                onBlur={() => setVisitados({ ...visitados, correo: true })}
                aria-invalid={visitados.correo && !correoValido}
                aria-describedby={visitados.correo && !correoValido ? "error-correo" : undefined} />
              {visitados.correo && !correoValido && <p className="error-campo" id="error-correo">Ingresa un correo válido, por ejemplo nombre@dominio.com.</p>}

              <label htmlFor="metodo">Método de pago</label>
              <select id="metodo" name="metodo" required value={formulario.metodo}
                onChange={(e) => setFormulario({ ...formulario, metodo: e.target.value })}>
                <option value="">Selecciona un método</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia bancaria</option>
                <option value="contraentrega">Pago contra entrega</option>
              </select>
              <label className="aceptacion" htmlFor="terminos">
                <input id="terminos" name="terminos" type="checkbox" required checked={formulario.terminos}
                  onChange={(e) => setFormulario({ ...formulario, terminos: e.target.checked })} />
                Acepto los términos y condiciones para pasar el parcial si Dios quiere.
              </label>
              <button type="submit" disabled={!puedeEnviar || enviando}>
                {enviando ? "Procesando pedido…" : "Confirmar pedido"}
              </button>
            </fieldset>
          </form>
        </div>
      )}
    </div>
  );
}
