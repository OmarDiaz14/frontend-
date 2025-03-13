import { Boton } from "../../components/Botones/Botones";
import Logo from "../../assets/Tlaxcala.png";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { invetario_post } from "../../services/inventario.services";
import Swal from "sweetalert2";
import { Inventario, InventarioFormAuth } from "../../services/var.inven";
import { useNavigate } from "react-router-dom";

export function FormAuth() {
  const [showDiv, setShowDiv] = useState(false);
  const { state } = useLocation();
  const { selectedInventory } = state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleback = () => {
    navigate("/TableInventory");
  };

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
    <div className="layoutAuthentication" style={{ paddingTop: "50 px " }}>
      <div className="layoutAuthentication_content">
        <main>
          <div className="container-fluid">
            <div className="row justify-content-center  pt-10">
              <div className="col-lg-8 col-md-10 col-sm-10">
                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#171717", color: "#fff" }}
                  >
                    <h5
                      className="text-center font-weight-light my-4"
                      style={{ fontSize: "20px" }}
                    >
                      Autorización
                    </h5>
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

                      <div className="d-flex justify-content-center gap-4 mt-4 mb-2">
                        <div className="mx-2">
                          <Boton onClick={handleback}>Atrás</Boton>
                        </div>
                        <div className="mx-2">
                          <Boton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Autorizando.." : "Autorizar"}
                          </Boton>
                        </div>
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
  );
}

export default FormAuth;
