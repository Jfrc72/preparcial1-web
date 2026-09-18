interface MensajeErrorProps {
  mensaje: string;
  onReintentar: () => void;
}

export default function MensajeError({ mensaje, onReintentar }: MensajeErrorProps) {
  return (
    <div className="estado error">
      <h2>No pudimos completar la consulta</h2>
      <p role="alert">{mensaje}</p>
      <button className="boton principal" onClick={onReintentar}>Reintentar</button>
    </div>
  );
}
