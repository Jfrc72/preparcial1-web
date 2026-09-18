import Link from "next/link";

export default function NoEncontrado() {
  return (
    <section className="estado">
      <p className="etiqueta">404</p>
      <h1>No encontramos esta página</h1>
      <p>Revisa la dirección o vuelve para explorar los productos.</p>
      <Link className="boton principal" href="/">Volver al catálogo</Link>
    </section>
  );
}
