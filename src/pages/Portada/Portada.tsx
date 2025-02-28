import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Boton } from "../../components/Botones/Botones";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { Seccion_get, serie_get } from "../../services/cuadro.service";
import { seccion, serie } from "../../services/var.cuadro";
import { portada_post } from "../../services/portada.services";
import { Portada } from "../../services/var.portada";
import "../../styles/Styles.css";
import { user_profile } from "../../services/user.services";

export function PortadaComponent() {
  const navigate = useNavigate();
  const [portada, setPortada] = useState<Portada>(new Portada());
  const [seccionNombre, setSeccionNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [id_seccion, setIdSeccion] = useState("");
  const [secciones, setSecciones] = useState<seccion[]>([]);
  const [id_serie, setSerie] = useState<serie[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [filteredSeries, setFilteredSeries] = useState<serie[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await user_profile();
        setUserInfo(user);
        setIdSeccion(user.id_seccion);

        const currentSection = secciones.find(
          (s) => s.id_seccion === parseInt(user.id_seccion)
        );
        if (currentSection) {
          setSeccionNombre(currentSection.seccion);
          setPortada((prevPortada) => ({
            ...prevPortada,
            seccion: currentSection.id_seccion,
          }));

          console.log("Sección actual:", currentSection.seccion);
        }
      } catch (error) {
        console.error("Error al obtener datos de usuario:", error);
      }
    };
    fetchUser();
  }, [secciones]);

  useEffect(() => {
    if (portada.seccion) {
      const filtered = id_serie.filter((s) => s.id_seccion === portada.seccion);
      setFilteredSeries(filtered);
    }
  }, [portada.seccion, id_serie]);

  useEffect(() => {
    const fetchData = async () => {
      const secciones = await Seccion_get();
      setSecciones(secciones);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const series = await serie_get();
      setSerie(series);
    };

    fetchData();
  }, []);

  const handleback = () => {
    navigate("/Portada");
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "serie") {
      const selectedSerie = id_serie.find(
        (serie) => serie.id_serie === parseInt(value)
      );

      if (selectedSerie) {
        setPortada((prevPortada) => ({
          ...prevPortada,
          serie: parseInt(value),
        }));
      }
    } else {
      setPortada((prevPortada) => ({
        ...prevPortada,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Datos a enviar:", portada);

    if (
      !portada.asunto.trim() ||
      !portada.num_legajos.trim() ||
      !portada.num_fojas.trim() ||
      !portada.valores_secundarios.trim() ||
      !portada.fecha_apertura.trim() ||
      !portada.fecha_cierre.trim() ||
      !portada.seccion ||
      !portada.serie
    ) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Todos los campos son obligatorios",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userDataStr = localStorage.getItem("user");
      const userData = userDataStr ? JSON.parse(userDataStr) : {};

      const portadaData = {
        ...portada,
        unidad_admi: userData.unidad_admi,
      };

      const result = await portada_post(portada);
      console.log("Respuesta de la API:", result);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Datos enviados exitosamente.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/Portada");
      });
    } catch (error) {
      console.error("Error al enviar datos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al enviar los datos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="layoutAuthentication" style={{ paddingTop: "50 px " }}>
      <div className="layoutAuthentication_content">
        <main>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10 col-sm-10 pt-10">
                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#171717", color: "#fff" }}
                  >
                    <h5
                      className="text-center font-weight-light my-4"
                      style={{ fontSize: "20px" }}
                    >
                      Portada de Expediente
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="form-row mt-4">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Nombre / Asunto del Expediente"
                              value={portada.asunto}
                              onChange={handleInputChange}
                              name="asunto"
                            />
                            <label>Nombre / Asunto del Expediente</label>
                          </div>
                        </div>
                      </div>

                      <div className="form-row mt-4">
                        <label> Valores Secundarios </label>
                        <div className="col">
                          <select
                            className="multisteps-form_input form-select"
                            id="item"
                            value={portada.valores_secundarios}
                            onChange={handleInputChange}
                            name="valores_secundarios"
                          >
                            <option>Seleccione el Valor Secundario</option>
                            <option value="informativo">Informativo</option>
                            <option value="evidencial">Evidencial</option>
                            <option value="testimonial">Testimonial</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label> Fecha Apertura </label>
                          <input
                            className="multisteps-form_input form-control"
                            type="date"
                            placeholder="Fecha Apertura"
                            value={portada.fecha_apertura}
                            onChange={handleInputChange}
                            name="fecha_apertura"
                          />
                        </div>
                      </div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label> Fecha de Cierre </label>
                          <input
                            className="multisteps-form_input form-control"
                            type="date"
                            placeholder="Fecha Cierre "
                            value={portada.fecha_cierre}
                            onChange={handleInputChange}
                            name="fecha_cierre"
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6 mt-4">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              type="number"
                              placeholder="Número de Legajos"
                              value={portada.num_legajos}
                              onChange={handleInputChange}
                              name="num_legajos"
                            />
                            <label>Número de Legajos</label>
                          </div>
                        </div>
                        <div className="col-md-6 mt-4">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              type="number"
                              placeholder="Número de Fojas"
                              value={portada.num_fojas}
                              onChange={handleInputChange}
                              name="num_fojas"
                            />
                            <label>Número de Fojas</label>
                          </div>
                        </div>
                      </div>

                      <div className="form-row mt-4">
                        <div className="col">
                          <label> Seccion </label>
                          <input
                            className="form-control"
                            id="inputSeccion"
                            type="text"
                            placeholder="Seccion"
                            value={seccionNombre}
                            disabled
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-row mt-4">
                        <div className="col">
                          <label> Serie </label>
                          <select
                            className="multisteps-form_input form-select"
                            id="Serie"
                            value={portada.serie}
                            onChange={handleInputChange}
                            name="serie"
                          >
                            <option value="">Seleccione una opción</option>
                            {filteredSeries.map((serie) => (
                              <option value={serie.id_serie}>
                                {serie.serie}
                              </option>
                            ))}
                          </select>
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
          </div>
        </main>
      </div>
    </div>
  );
}
