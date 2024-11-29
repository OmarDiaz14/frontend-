import { Boton } from "../../components/Botones/Botones";
import { useNavigate } from "react-router-dom";
import {
  catalogo_post,
  destino_get,
  type_get,
  valor_get,
} from "../../services/catalogo.service";
import { useState, useEffect } from "react";
import {
  Seccion_get,
  serie_get,
  subserie_get,
} from "../../services/cuadro.service";
import { seccion, serie, SubSerie } from "../../Producto";
import { valor, type, destino } from "../../services/var.catalogo";
import "../../styles/Styles.css";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2";
import LogoImg from "../../assets/Tlaxcala.png";

export function Catálogo() {
  const navigate = useNavigate();
  const [id_catalogo] = useState("");
  const [catalogo, setCatalogo] = useState("");
  const [archivo_tramite, setArchivoTramite] = useState("Durante su Vigencia");
  const [archivo_concentracion, setArchivoConcentracion] = useState(
    "Durante su vigencia"
  );
  const [destino_expe, setDestinoExpe] = useState("");
  const [type_access, setTypeAccess] = useState("");
  const [valores_documentales, setValoresDocumentales] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [id_seccion, setIdSeccion] = useState("");
  const [id_serie, setIdSerie] = useState("");
  const [id_subserie, setIdSubserie] = useState("");
  const [secciones, setSeccion] = useState<seccion[]>([]);
  const [valor, setValor] = useState<valor[]>([]);
  const [type, setType] = useState<type[]>([]);
  const [destiny, setDestiny] = useState<destino[]>([]);
  const [serie, setSerie] = useState<serie[]>([]);
  const [subserie, setSubSerie] = useState<SubSerie[]>([]);

  const [filteredSeries, setFilteredSeries] = useState<serie[]>([]);
  const [filteredSubseries, setFilteredSubseries] = useState<SubSerie[]>([]);

  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      const user = JSON.parse(userDataStr);
      setUserInfo(user);

      setIdSeccion(user.unidad_admi);
    }
  }, []);

  useEffect(() => {
    if (id_seccion) {
      const filtered = serie.filter((s) => s.id_seccion === id_seccion);
      setFilteredSeries(filtered);
    }
  }, [id_seccion, serie]);

  useEffect(() => {
    if (id_serie) {
      const filtered = subserie.filter((sub) => sub.serie === id_serie);
      setFilteredSubseries(filtered);
    }
  }, [id_serie, subserie]);

  // Fetch data effects remain the same...
  useEffect(() => {
    const fetchSeccion = async () => {
      const items = await Seccion_get();
      setSeccion(items);
    };
    fetchSeccion();
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

  useEffect(() => {
    const fetchValor = async () => {
      const items = await valor_get();
      setValor(items);
    };
    fetchValor();
  }, []);

  useEffect(() => {
    const fetchtype = async () => {
      const items = await type_get();
      setType(items);
    };
    fetchtype();
  }, []);

  useEffect(() => {
    const fetchdestiny = async () => {
      const items = await destino_get();
      setDestiny(items);
    };
    fetchdestiny();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !catalogo.trim() ||
      !archivo_tramite.trim() ||
      !archivo_concentracion.trim() ||
      !destino_expe.trim() ||
      !type_access.trim() ||
      !valores_documentales.trim() ||
      !observaciones.trim() ||
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

    const CatalogoData = {
      id_catalogo,
      catalogo,
      archivo_tramite,
      archivo_concentracion,
      destino_expe,
      type_access,
      valores_documentales,
      observaciones,
      id_seccion,
      id_serie,
      id_subserie,
    };

    try {
      const result = await catalogo_post(CatalogoData);
      console.log("Respuesta de la API:", result);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Datos enviados exitosamente.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/Catálogo");
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
      <img className="Logo_imgRU" src={LogoImg} alt="" width="25%" />
      <div className="layoutAuthentication">
        <div className="layoutAuthentication_content">
          <main>
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header">
                      <h3 className="text-center font-weight-light my-4">
                        Catálogo de Disposición Documental
                      </h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
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
                              <label>ID Sección</label>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-floating">
                              <select
                                className="form-control form-select"
                                value={id_serie}
                                onChange={(e) => {
                                  setIdSerie(e.target.value);
                                  setIdSubserie("");
                                }}
                              >
                                <option value="">Seleccione una opción</option>
                                {filteredSeries.map((s) => (
                                  <option value={s.serie}>{s.serie}</option>
                                ))}
                              </select>
                              <label>ID Serie</label>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="form-floating">
                              <select
                                className="form-control form-select"
                                value={id_subserie}
                                onChange={(e) => setIdSubserie(e.target.value)}
                              >
                                <option value="">Seleccione una opción</option>
                                {filteredSubseries.map((sub) => (
                                  <option value={sub.SubSerie}>
                                    {sub.SubSerie}
                                  </option>
                                ))}
                              </select>
                              <label>ID Subserie</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                placeholder="ID Catálogo"
                                value={catalogo}
                                onChange={(e) => setCatalogo(e.target.value)}
                              />
                              <label>Nombre del Catálogo</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <select
                                className="form-control form-select"
                                value={valores_documentales}
                                onChange={(e) =>
                                  setValoresDocumentales(e.target.value)
                                }
                              >
                                <option value="">Seleccione una opción</option>
                                {valor.map((valor) => (
                                  <option value={valor.id_valores}>
                                    {valor.valores}
                                  </option>
                                ))}
                              </select>
                              <label>Valores Documentales</label>
                            </div>
                          </div>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                          />
                          <label>Observaciones</label>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="text"
                                value="Durante su vigencia"
                                onChange={(e) =>
                                  setArchivoTramite("Durante su vigencia")
                                }
                                readOnly
                              />
                              <label>Archivo de Trámite</label>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                type="number"
                                value={archivo_concentracion}
                                onChange={(e) =>
                                  setArchivoConcentracion(e.target.value)
                                }
                              />
                              <label>Archivo de Concentración</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <select
                                className="form-control form-select"
                                value={type_access}
                                onChange={(e) => setTypeAccess(e.target.value)}
                              >
                                <option value="">Seleccione una opción</option>
                                {type.map((type) => (
                                  <option value={type.id_type}>
                                    {type.type}
                                  </option>
                                ))}
                              </select>
                              <label>Tipo de Acceso</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <select
                                className="form-control form-select"
                                value={destino_expe}
                                onChange={(e) => setDestinoExpe(e.target.value)}
                              >
                                <option value="">Seleccione una opción</option>
                                {destiny.map((destiny) => (
                                  <option value={destiny.id_destino}>
                                    {destiny.destino}
                                  </option>
                                ))}
                              </select>
                              <label>Destino del expediente</label>
                            </div>
                          </div>
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
          </main>
        </div>
      </div>
    </body>
  );
}
