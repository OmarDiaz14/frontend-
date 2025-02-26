import { useState, useEffect } from "react";
import { Boton } from "../../components/Botones/Botones";
import { serie_get, subserie_post } from "../../services/cuadro.service";
import { serie } from "../../services/var.cuadro";
import { TableSubserie } from "./TableSubSerie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export function Subserie() {
  const [Descripcion, setDescripcion] = useState("");
  const [codigo, setCodigo] = useState("");
  const [Serie, setSerie] = useState("");
  const [SerieGet, setSerieGet] = useState<serie[]>([]);
  const [subserie, setsubserie] = useState("");
  const [refreshTable, setRefreshTable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSerie = async () => {
      const items = await serie_get();
      setSerieGet(items);
    };
    fetchSerie();
  }, []);

  const handleback = () => {
    navigate("/Home");
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!subserie.trim() || !Descripcion.trim() || !Serie.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    const SubserieData = {
      id_subserie: "",
      subserie: subserie,
      codigo_subserie: codigo,
      descripcion: Descripcion,
      id_serie: Serie,
    };

    try {
      const result = await subserie_post(SubserieData);
      console.log("Respuesta de la APi:", result);

      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Se ha creado la subserie con exito",
      });

      setsubserie("");
      setDescripcion("");
      setSerie("");

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
                              id="inputSerie"
                              value={Serie}
                              onChange={(e) => setSerie(e.target.value)}
                            >
                              <option value="">Seleccione una opción</option>
                              {SerieGet.map((serie) => (
                                <option key={serie.serie} value={serie.serie}>
                                  {serie.serie}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="inputSerie">Serie</label>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputSubserie"
                              type="text"
                              placeholder="ID Subserie"
                              value={Descripcion}
                              onChange={(e) => setDescripcion(e.target.value)}
                            />
                            <label htmlFor="inputSubserie">
                              Código de la Sub-serie
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="inputDescripcion"
                          type="text"
                          placeholder="Nombre Sub-Serie"
                          value={subserie}
                          onChange={(e) => setsubserie(e.target.value)}
                        />
                        <label htmlFor="inputDescripcion">
                          Nombre Sub-Serie
                        </label>
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
                <TableSubserie key={refreshTable} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Subserie;
