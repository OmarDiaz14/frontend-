import { useEffect, useState } from "react";
import { Boton } from "../../components/Botones/Botones";
import { Seccion_get, serie_post } from "../../services/cuadro.service";
import { seccion } from "../../services/var.cuadro";
import { TableSerie } from "./TableSerie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function Serie() {
  const [Serie, setSerie] = useState("");
  const [Codigo, setCode] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [ID_seccion, setId_seccion] = useState("");
  const [secciones, setSeccion] = useState<seccion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeccion = async () => {
      try {
        const items = await Seccion_get();
        setSeccion(items);
      } catch (error) {
        console.error("Error al obtener las secciones:", error);
      }
    };
    fetchSeccion();
  }, []);

  const handleback = () => {
    navigate("/Home");
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (
      !Serie.trim() ||
      !Codigo.trim() ||
      !Descripcion.trim() ||
      !ID_seccion.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    const serie = {
      id_serie: "",
      serie: Serie,
      codigo_serie: Codigo,
      descripcion: Descripcion,
      id_seccion: ID_seccion,
    };

    try {
      const result = await serie_post(serie);
      console.log("Respuesta de la APi:", result);

      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Se ha creado la serie con exito",
      });

      setSerie("");
      setCode("");
      setDescripcion("");
      setId_seccion("");

      setRefreshTable((prev) => prev + 1);
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Algo salio mal. Por favor intente de nuevo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="layoutAuthentication" style={{ paddingTop: "50px" }}>
      <div className="layoutAuthentication_content">
        <main>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-9 col-md-10 col-sm-12">
                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#171717", color: "#fff" }}
                  >
                    <h5
                      className="text-center font-weight-light my-4"
                      style={{ fontSize: "20px" }}
                    >
                      Cuadro General de Clasificación Archivística
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6 col-sm-12">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              id="inputSeccion"
                              value={ID_seccion}
                              onChange={(e) => setId_seccion(e.target.value)}
                            >
                              <option value="">Seleccione una opción</option>
                              {secciones.map((seccion) => (
                                <option
                                  key={seccion.id_seccion}
                                  value={seccion.id_seccion}
                                >
                                  {seccion.seccion}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="inputSeccion">Sección</label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputSerie"
                              type="text"
                              placeholder="Serie"
                              value={Serie}
                              onChange={(e) => setSerie(e.target.value)}
                            />
                            <label htmlFor="inputSerie">
                              Nombre de la serie
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6 col-sm-12">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputCodigo"
                              type="text"
                              placeholder="Código"
                              value={Codigo}
                              onChange={(e) => setCode(e.target.value)}
                            />
                            <label htmlFor="inputSerie">
                              Código de la serie
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputDescripcion"
                              type="text"
                              placeholder="Descripción"
                              value={Descripcion}
                              onChange={(e) => setDescripcion(e.target.value)}
                            />
                            <label htmlFor="inputDescripcion">
                              Descripción
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center gap-4 mt-4 mb-2">
                        <div className="mx-2">
                          <Boton onClick={handleback}>Atrás</Boton>
                        </div>
                        <div className="mx-2">
                          <Boton disabled={isLoading}>
                            {isLoading ? "Creando..." : "Crear"}
                          </Boton>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center mt-4">
              <div className="col-lg-9 col-md-10 col-sm-12">
                <TableSerie key={refreshTable} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Serie;
