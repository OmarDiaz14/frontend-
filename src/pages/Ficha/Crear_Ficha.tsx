import { Boton } from "../../components/Botones/Botones";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ficha_post } from "../../services/ficha.services";
import { seccion, serie, SubSerie } from "../../Producto";
import "../../styles/Styles.css";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2";
import {
  Seccion_get,
  serie_get,
  subserie_get,
} from "../../services/cuadro.service";
import Logo2 from "../../assets/Tlaxcala.png";

export function Ficha() {
  const navigate = useNavigate();
  const [id_ficha, setID] = useState("");
  const [area_resguardante, setResguardante] = useState("");
  const [area_intervienen, setIntervienen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [soporte_docu, setSoporte] = useState("");
  const [id_seccion, setIdSeccion] = useState("");
  const [id_serie, setIdSerie] = useState("");
  const [id_subserie, setIdSubserie] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [serie, setSerie] = useState<serie[]>([]);
  const [subserie, setSubSerie] = useState<SubSerie[]>([]);

  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      const user = JSON.parse(userDataStr);
      setUserInfo(user);

      setIdSeccion(user.unidad_admi);
    }
  }, []);

  useEffect(() => {
    const fetchSerie = async () => {
      const items = await serie_get();
      setSerie(items);
    };
    fetchSerie();
  }, []);

  useEffect(() => {
    const fetchSubSerie = async () => {
      const items = await subserie_get();
      setSubSerie(items);
    };
    fetchSubSerie();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !id_ficha.trim() ||
      !area_resguardante.trim() ||
      !area_intervienen.trim() ||
      !descripcion.trim() ||
      !soporte_docu.trim() ||
      !id_seccion.trim() ||
      !id_serie.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    const fichaData = {
      id_ficha: id_ficha,
      area_resguardante: area_resguardante,
      area_intervienen: area_intervienen,
      soporte_docu: soporte_docu,
      descripcion: descripcion,
      id_seccion: id_seccion,
      id_serie: id_serie,
      id_subserie: id_subserie,
    };

    try {
      const result = await ficha_post(fichaData);
      console.log("Respuesta de la API:", result);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Datos enviados exitosamente.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/Ficha");
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
    <body>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      <img className="Logo_imgRU" src={Logo2} alt="" width={"25%"} />
      <div className="layoutAuthentication">
        <div className="layoutAuthentication_content">
          <main>
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header">
                      <h3 className="text-center font-weight-light my-4">
                        Ficha Técnica de Valoración Documental
                      </h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputIdFicha"
                            type="text"
                            placeholder="ID Ficha"
                            value={id_ficha}
                            onChange={(e) => setID(e.target.value)}
                          />
                          <label htmlFor="inputIdFicha">ID Ficha</label>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputAreaResguardante"
                            type="text"
                            placeholder="Área Resguardante"
                            value={area_resguardante}
                            onChange={(e) => setResguardante(e.target.value)}
                          />
                          <label htmlFor="inputAreaResguardante">
                            Área Resguardante
                          </label>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputAreaIntervienen"
                            type="text"
                            placeholder="Áreas que Intervienen"
                            value={area_intervienen}
                            onChange={(e) => setIntervienen(e.target.value)}
                          />
                          <label htmlFor="inputAreaIntervienen">
                            Áreas que Intervienen
                          </label>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputDescripcion"
                            type="text"
                            placeholder="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                          />
                          <label htmlFor="inputDescripcion">Descripción</label>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputSoporteDocu"
                            type="text"
                            placeholder="Soporte Documental"
                            value={soporte_docu}
                            onChange={(e) => setSoporte(e.target.value)}
                          />
                          <label htmlFor="inputSoporteDocu">
                            Soporte Documental
                          </label>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                id="inputSeccion"
                                type="text"
                                placeholder="Seccion"
                                value={id_seccion}
                                disabled
                                readOnly
                              />
                              <label htmlFor="inputSeccion">ID Sección</label>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-floating">
                              <select
                                className="form-select"
                                id="inputSerie"
                                value={id_serie}
                                onChange={(e) => setIdSerie(e.target.value)}
                              >
                                <option value="">Seleccione una opción</option>
                                {serie.map((s) => (
                                  <option key={s.serie} value={s.serie}>
                                    {s.serie}
                                  </option>
                                ))}
                              </select>
                              <label htmlFor="inputSerie">ID Serie</label>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="form-floating">
                              <select
                                className="form-select"
                                id="inputSubserie"
                                value={id_subserie}
                                onChange={(e) => setIdSubserie(e.target.value)}
                              >
                                <option value="">Seleccione una opción</option>
                                {subserie.map((sub) => (
                                  <option
                                    key={sub.SubSerie}
                                    value={sub.SubSerie}
                                  >
                                    {sub.SubSerie}
                                  </option>
                                ))}
                              </select>
                              <label htmlFor="inputSubserie">ID Subserie</label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Boton disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar"}
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
