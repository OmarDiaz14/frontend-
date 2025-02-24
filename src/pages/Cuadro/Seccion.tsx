import { useState } from "react";
import { Boton } from "../../components/Botones/Botones";
import { seccion_post } from "../../services/cuadro.service";
import { TableSeccion } from "./TableSeccion";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

export function Seccion() {
  const [ID, setID] = useState("");
  const [seccion, setSeccion] = useState("");
  const [Codigo, setCode] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [refreshTable, setRefreshTable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!Codigo.trim() || !Descripcion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    const Seccion = {
      id_seccion: "",
      seccion: seccion,
      codigo_seccion: Codigo,
      descripcion: Descripcion,
    };

    try {
      const result = await seccion_post(Seccion);
      console.log("Respuesta de la APi:", result);

      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Se ha agregado la sección con exito",
      });

      setID("");
      setCode("");
      setSeccion("");
      setDescripcion("");
      setRefreshTable((prev) => prev + 1);
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Ooops",
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
                            <input
                              className="form-control"
                              id="inputID"
                              type="text"
                              placeholder="ID Sección"
                              value={ID}
                              onChange={(e) => setID(e.target.value)}
                            />
                            <label
                              htmlFor="inputID"
                              style={{ fontSize: "16px" }}
                            >
                              ID Sección
                            </label>
                              <input
                            </div>
                          </div>
                        </div>
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
                            <label
                              htmlFor="inputCodigo"
                              style={{ fontSize: "16px" }}
                            >
                              Código
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="inputDescripcion"
                          type="text"
                          placeholder="Descripción"
                          value={Descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                        />
                        <label
                          htmlFor="inputDescripcion"
                          style={{ fontSize: "16px" }}
                        >
                          Descripción
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
            <div className="row justify-content-center mt-4">
              <div className="col-lg-9 col-md-10 col-sm-12">
                <TableSeccion key={refreshTable} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Seccion;
