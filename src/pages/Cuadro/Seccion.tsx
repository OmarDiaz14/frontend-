import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Logo from "../../assets/Tlaxcala.png";
import { Boton } from "../../components/Botones/Botones";
import { seccion_post, Seccion_get } from "../../services/cuadro.service";
import { seccion } from "../../Producto";
import Swal from "sweetalert2";

export function Seccion() {
  const [ID, setID] = useState("");
  const [Codigo, setCode] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seccion, setSeccion] = useState<seccion[]>([]);

  useEffect(() => {
    const fetchSeccion = async () => {
      const items = await Seccion_get();
      setSeccion(items);
    };
    fetchSeccion();
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!ID.trim() || !Codigo.trim() || !Descripcion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    const Seccion = {
      id_seccion: ID,
      codigo: Codigo,
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
      setDescripcion("");

      const updatedItems = await Seccion_get();
      setSeccion(updatedItems);
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

  const columns: GridColDef[] = [
    /* {
      field: "id_seccion",
      headerName: "Código de la Sección ",
      flex: 1,
      minWidth: 150,
      headerClassName: "table-header",
    },*/
    {
      field: "codigo",
      headerName: "Código de la Sección ",
      flex: 1.5,
      minWidth: 200,
      headerClassName: "table-header",
    },
    {
      field: "descripcion",
      headerName: "Nombre de la Sección",
      flex: 2,
      minWidth: 250,
      headerClassName: "table-header",
    },
  ];

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
                                id="inputID"
                                type="text"
                                placeholder="ID Sección"
                                value={ID}
                                onChange={(e) => setID(e.target.value)}
                              />
                              <label htmlFor="inputID">ID Sección</label>
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
            </div>

            <div className="container-fluid mt-5">
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <div className="card shadow-lg border-0 rounded-lg">
                    <div className="card-body">
                      <Box
                        sx={{
                          height: 400,
                          width: "100%",
                          "& .table-header": {
                            backgroundColor: "#f8fafc",
                            color: "#1f2937",
                            fontWeight: 600,
                          },
                          "& .MuiDataGrid-root": {
                            border: "none",
                            "& .MuiDataGrid-cell": {
                              borderBottom: "1px solid #f1f5f9",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                              borderBottom: "2px solid #e2e8f0",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                              backgroundColor: "#ffffff",
                            },
                          },
                        }}
                      >
                        <DataGrid
                          rows={seccion}
                          columns={columns}
                          getRowId={(x) => x.id_seccion}
                          disableRowSelectionOnClick
                          density="comfortable"
                          initialState={{
                            pagination: {
                              paginationModel: { pageSize: 5 },
                            },
                          }}
                          pageSizeOptions={[5, 10, 25]}
                        />
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </body>
  );
}

export default Seccion;
