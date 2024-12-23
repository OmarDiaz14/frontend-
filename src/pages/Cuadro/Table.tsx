import { TableSeccion } from "./TableSeccion";
import { TableSerie } from "./TableSerie";
import { TableSubserie } from "./TableSubSerie";
import "./Table.css";

export function CuadroGeneral() {
  return (
    <body>
      <div className="Cuadro">
        <div className="max-w-7x1 mx-auto px-4 py-8 Titulo">
          <h1>Sección</h1>
        </div>
        <div className="Card">
          <TableSeccion></TableSeccion>
        </div>
        <div className="max-w-7x1 mx-auto px-4 py-8 Titulo">
          <h1>Serie</h1>
        </div>
        <TableSerie></TableSerie>
        <div className="max-w-7x1 mx-auto px-4 py-8 Titulo">
          <h1>Subserie</h1>
        </div>
        <TableSubserie></TableSubserie>
      </div>
    </body>
  );
}
