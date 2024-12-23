import { Logo } from "../../components/Logo";
import { Tabla } from "../../components/Tablas/Tabla";
import { GraficoExpedientes } from "../../components/dashboard/Charts";
import { TableInventory } from "../Inventario/TableInventario";

export function Home() {
  // Datos de ejemplo para los expedientes en gráfico de pie.
  const expedientesNuevos = 10;
  const expedientesEnProceso = 5;
  const expedientesFinalizados = 3;

  return (
    <main id="Home" className="Home">
      <Logo />
      <Tabla />
      <GraficoExpedientes
        nuevos={expedientesNuevos}
        enProceso={expedientesEnProceso}
        finalizados={expedientesFinalizados}
      />
    </main>
  );
}
