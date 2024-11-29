import { useState, useEffect } from "react";
import Logo from "../../assets/Tlaxcala.png";
import { Boton } from "../../components/Botones/Botones";
import { serie_get, subserie_post } from "../../services/cuadro.service";
import { serie } from "../../Producto";
import { TableSubserie } from "./TableSubSerie";
import Swal from "sweetalert2";

export function Subserie() {
  const [Descripcion, setDescripcion] = useState("");
  const [Serie, setSerie] = useState("");
  const [SerieGet, setSerieGet] = useState<serie[]>([]);
  const [subserie, setsubserie] = useState("");
  const [refreshTable, setRefreshTable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSerie = async () => {
      const items = await serie_get();
      setSerieGet(items);
    };
    fetchSerie();
  }, []);

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
      SubSerie: subserie,
      descripcion: Descripcion,
      serie: Serie,
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
    <body>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      ></link>
      <img className="Logo_imgRU" src={Logo} alt="" width={"25%"} />
      <div className="layoutAuthentication">
        <div className="layoutAuthentication_content">
          <main>
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header">
                      <h3 className="text-center font-weight-light my-4">
                        Cuadro General de Clasificación Archivística
                      </h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <select
                                className="form-select"
                                id="inputSerie"
                                value={Serie}
                                onChange={(e) => setSerie(e.target.value)}
                              >
                                <option value="">Seleccione una opción</option>
                                {SerieGet.map((serie) => (
                                  <option value={serie.serie}>
                                    {serie.serie}
                                  </option>
                                ))}
                              </select>
                              <label htmlFor="inputSerie">Serie</label>
                            </div>
                          </div>
                          <div className="col-md-6">
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
                                Codigo de la Sub-serie
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

                        <div className="mt-4 mb-0">
                          <div className="d-grid">
                            <Boton disabled={isLoading}>
                              {isLoading ? "Enviando..." : "Enviar"}
                            </Boton>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <TableSubserie key={refreshTable}></TableSubserie>
            </div>
          </main>
        </div>
      </div>
    </body>
  );
}

export default Subserie;
