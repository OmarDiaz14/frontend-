import { Logo } from "../../components/Logo";
import { CardContainer } from "../../components/Cards/Contenedor_Cards";
import { Tabla } from "../../components/Tablas/Tabla";
export function Expediente() {
  return (
    <div className="Expediente">
      <Logo />
      <CardContainer />
      <Tabla />
    </div>
  );
}
