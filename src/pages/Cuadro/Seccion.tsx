  import { useState } from "react";
  import Logo from "../../assets/Tlaxcala.png";
  import { Boton } from "../../components/Botones/Botones";
  import { seccion_post } from "../../services/cuadro.service";
  import { TableSeccion } from "./TableSeccion";
  import Swal from "sweetalert2";

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
                                <input
                                  className="form-control"
                                  id="inputSeccion"
                                  type="text"
                                  placeholder="Sección"
                                  value={seccion}
                                  onChange={(e) => setSeccion(e.target.value)}
                                />
                                <label htmlFor="inputSeccion">Sección</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-floating">
                                <input
                                  className="form-control"
                                  id="inputCodigo"
                                  type="text"
                                  placeholder="Código"
                                  value={Codigo}
                                  onChange={(e) => setCode(e.target.value)}
                                />
                                <label htmlFor="inputCodigo">Código</label>
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
                            <label htmlFor="inputDescripcion">Descripción</label>
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
                <TableSeccion key={refreshTable}></TableSeccion>
              </div>
            </main>
          </div>
        </div>
      </body>
    );
  }

  export default Seccion;
