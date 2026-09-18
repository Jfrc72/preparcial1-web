import Catalogo from "@/components/Catalogo";

export default function Inicio() {
  return (
    <>
      <section className="presentacion">
        <p className="etiqueta">BIENVENIDO A SHOPHUB</p>
        <h1>Encuentra tu próximo favorito.</h1>
        <p>Explora nuestros productos, conoce sus detalles y agrega lo que te guste a tu carrito.</p>
      </section>
      <Catalogo />
    </>
  );
}
