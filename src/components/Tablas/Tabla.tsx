import { useState, ChangeEvent } from "react";
import { Card, CardBody, Table, Input } from "reactstrap";
import "../../styles/Styles.css";
/*import { ImSearch } from "react-icons/im";*/

/*Falta extraer la información*/

const expedienteData = [
  {
    expediente: "EXP-2024-09",
    descripcion: "Solicitud de Información",
    responsable: "Kirby Alondra Lima Zamudio",
    fechaCreacion: "2024-09-15",
    estado: "Nuevo",
    valor_documental: "Administrativo",
  },
  {
    expediente: "EXP-2024-08",
    descripcion: "Solicitud de Información ",
    responsable: "Claudia Zamudio Sánchez ",
    fechaCreacion: "2024-08-10",
    estado: "Finalizado",
    valor_documental: "Legal",
  },

  {
    expediente: "EXP-2024-07",
    descripcion: "Solicitud de Información",
    responsable: "Jose Luis Lima González ",
    fechaCreacion: "2024-08-10",
    estado: "Finalizado",
    valor_documental: "Legal",
  },
  {
    expediente: "EXP-2024-06",
    descripcion: "Solicitud de Información",
    responsable: "Sergio Javier Cirio Zamudio ",
    fechaCreacion: "2024-08-10",
    estado: "Proceso",
    valor_documental: "Fiscal",
  },
];

export const Tabla = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = expedienteData.filter(
    (edata) =>
      edata.expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edata.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edata.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edata.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edata.valor_documental.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="Contenedor_Tabla">
      {/* Campo de búsqueda */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/*    <ImSearch className="Buscar_Icono" /> */}
        <Input
          type="text"
          placeholder="Buscar expediente"
          value={searchTerm}
          onChange={handleSearch}
          className="Campo_Busqueda"
        />
      </div>

      <Card className="Card_Tabla">
        <CardBody>
          <Table className="Tabla mt-3 align-middle">
            <thead>
              <tr>
                <th>Número de Expediente</th>
                <th>Descripción</th>
                <th>Responsable</th>
                <th>Fecha de Creación</th>
                <th>Estado</th>
                <th>Valor Documental</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((edata, index) => (
                  <tr key={index} className="row">
                    <td>{edata.expediente}</td>
                    <td>{edata.descripcion}</td>
                    <td>{edata.responsable}</td>
                    <td>{edata.fechaCreacion}</td>
                    <td>
                      <span
                        className={`Estado_Tabla ${edata.estado.toLowerCase()}`}
                      >
                        {edata.estado}
                      </span>
                    </td>
                    <td>{edata.valor_documental}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};
