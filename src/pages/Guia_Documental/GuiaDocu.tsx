import { Guia } from "../../services/var.guia";
import { useEffect, useState } from "react";
import { Portada } from "../../services/var.portada";
import { portada_get } from "../../services/portada.services";
import Swal from "sweetalert2";
import { guia_post } from "../../services/gui.service";
import { Boton } from "../../components/Botones/Botones";
import { serie, seccion } from "../../services/var.cuadro";
import { serie_get, Seccion_get } from "../../services/cuadro.service";
import { TableGuia } from "../Guia_Documental/TableGuia";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export function GuiaDocu() {
  const navigate = useNavigate();
  const initialUserState = new Guia();
  const [guia, setGuia] = useState<Guia>(initialUserState);
  const [refreshTable, setRefreshTable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [Portada, setPortada] = useState<Portada[]>([]);
  const [Serie, setSerie] = useState<serie[]>([]);
  const [Seccion, setSeccion] = useState<seccion[]>([]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setGuia((prevGuia) => ({
      ...prevGuia,
      [name]: value,
    }));
  };

  const handleback = () => {
    navigate("/Home");
  };

  useEffect(() => {
    const fetchPortada = async () => {
      const items = await portada_get();
      setPortada(items);
    };
    fetchPortada();
  }, []);

  useEffect(() => {
    const fetchSerie = async () => {
      const items = await serie_get();
      setSerie(items);
    };
    fetchSerie();
  }, []);

  useEffect(() => {
    const fetchSeccion = async () => {
      const items = await Seccion_get();
      setSeccion(items);
    };
    fetchSeccion();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !guia.num_expediente.trim() ||
      !guia.descripcion.trim() ||
      !guia.ubicacion_fisica.trim() ||
      !guia.volumen.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    try {
      const result = await guia_post(guia);
      console.log("Respuesta de la API:", result);
      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Se ha enviado el formulario correctamente",
        timer: 1500,
        showConfirmButton: false,
      });

      setRefreshTable((prev) => prev + 1);
      setGuia(initialUserState);
    } catch (error) {
      console.log("Error", error);
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Ha ocurrido un error al enviar el formulario",
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
                      Guía Documental
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6 col-sm-12">
                          <div className="form-floating">
                            <select
                              className="multisteps-form_input form-select"
                              id="NE"
                              value={guia.num_expediente}
                              onChange={handleInputChange}
                              name="num_expediente"
                            >
                              <option value="">
                                Seleccione el número de expediente
                              </option>

                              {Portada.map((portada) => (
                                <option
                                  key={portada.id_expediente}
                                  value={portada.id_expediente}
                                >
                                  {portada.num_expediente}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputCargo"
                              type="text"
                              placeholder="Coloca el cargo"
                              value={guia.descripcion}
                              onChange={handleInputChange}
                              name="descripcion"
                            />

                            <label htmlFor="input Descripcion">
                              Descripción
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6 col-sm-12">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputCargo"
                              type="text"
                              placeholder="Coloca el cargo"
                              value={guia.ubicacion_fisica}
                              onChange={handleInputChange}
                              name="ubicacion_fisica"
                            />

                            <label htmlFor="input Descripcion">
                              Ubicación Física
                            </label>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputEmail"
                              type="number"
                              placeholder="name@example.com"
                              value={guia.volumen}
                              onChange={handleInputChange}
                              name="volumen"
                            />

                            <label htmlFor="inputVolumen">Volúmen</label>
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
                <TableGuia key={refreshTable} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
