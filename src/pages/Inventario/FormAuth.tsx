import { Boton } from "../../components/Botones/Botones";
import Logo from "../../assets/Tlaxcala.png";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { invetario_post } from "../../services/inventario.services";
import Swal from "sweetalert2";
import { Inventario, InventarioFormAuth } from "../../services/var.inven";

export function FormAuth() {
  const [showDiv, setShowDiv] = useState(false);
  const { state } = useLocation();
  const { selectedInventory } = state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!selectedInventory) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay datos para enviar",
      });
      return;
    }

    setIsSubmitting(true);

    const payload: InventarioFormAuth = {
      serie: selectedInventory.serie || "",
      expediente: selectedInventory.id_expediente || "",
    };

    try {
      const response = await invetario_post(payload);
      Swal.fire({
        icon: "success",
        title: "Exito",
        text: "Se ha enviado el inventario correctamente",
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al enviar los datos. Por favor, verifica los detalles.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedInventory) {
    Swal.fire({
      icon: "warning",
      title: "Advertencia",
      text: "No se han proporcionado datos para mostrar.",
    });
  }
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
                      {" "}
                      <h3 className="text-center font-weight-light my-4">
                        {" "}
                        Autorización
                      </h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        {/* */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.id_expediente || ""}
                                disabled
                              />
                              <label htmlFor="">Numero Consecutivo</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.num_expediente || ""}
                                disabled
                              />
                              <label htmlFor="">Numero Expediente</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.serie || ""}
                                disabled
                              />
                              <label htmlFor="">Serie</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.fecha_apertura || ""}
                                disabled
                              />
                              <label htmlFor="">Fecha de inicio</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.fecha_cierre || ""}
                                disabled
                              />
                              <label htmlFor="">Fecha de fin</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.num_legajos || ""}
                                disabled
                              />
                              <label htmlFor="">Numero de legajos</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.num_fojas || ""}
                                disabled
                              />
                              <label htmlFor="">Numero de fojas</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.valor_primario || ""}
                                disabled
                              />
                              <label htmlFor="">Valores primarios</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.soporte_docu || ""}
                                disabled
                              />
                              <label htmlFor="">Soporte</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.destino || ""}
                                disabled
                              />
                              <label htmlFor="">Destino</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value={selectedInventory.type || ""}
                                disabled
                              />
                              <label htmlFor="">Tipo de acceso</label>
                            </div>
                          </div>
                        </div>

                        <div className="d-grid gap-2 mt-4">
                          <Boton type="submit" disabled={isSubmitting}>
                            {isSubmitting
                              ? "Enviando..."
                              : "Confirmar y Guardar"}
                          </Boton>
                        </div>
                      </form>
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

export default FormAuth;
