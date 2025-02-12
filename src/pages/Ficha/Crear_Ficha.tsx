import { Boton } from "../../components/Botones/Botones";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ficha_post } from "../../services/ficha.services";
import { seccion, serie, SubSerie } from "../../services/var.cuadro";
import Swal from "sweetalert2";
import {
  Seccion_get,
  serie_get,
  subserie_get,
} from "../../services/cuadro.service";
import Logo2 from "../../assets/Tlaxcala.png";
import { user_profile } from "../../services/user.services";

export function Ficha() {
  const navigate = useNavigate();
  const [seccionNombre, setSeccionNombre] = useState("");
  const [id_ficha, setID] = useState("");
  const [ficha, setFicha] = useState("");
  const [area_resguardante, setResguardante] = useState("");
  const [area_intervienen, setIntervienen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [soporte_docu, setSoporte] = useState("");
  const [topologia, setTopologia] = useState("");
  const [id_seccion, setIdSeccion] = useState("");
  const [id_serie, setIdSerie] = useState("");
  const [id_subserie, setIdSubserie] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const [filteredSeries, setFilteredSeries] = useState<serie[]>([]);
  const [filteredSubseries, setFilteredSubseries] = useState<SubSerie[]>([]);
  const [secciones, setSeccion] = useState<seccion[]>([]);
  const [serie, setSerie] = useState<serie[]>([]);
  const [subserie, setSubSerie] = useState<SubSerie[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await user_profile();
        setUserInfo(user);
        setIdSeccion(user.id_seccion);
        
        // Find the section name corresponding to the ID
        const currentSection = secciones.find(s => s.id_seccion === parseInt(user.id_seccion));
        if (currentSection) {
          setSeccionNombre(currentSection.seccion);
        }
      } catch (error) {
        console.error("No jalo", error);
      }
    };
    fetchUser();
  }, [secciones]);

  useEffect(() => {
  console.log("Serie data:", serie);
  console.log("Id Seccion:", id_seccion);


    if (id_seccion) {
      const filtered = serie.filter((s) => s.id_seccion === parseInt (id_seccion));
      console.log("Filtered series:", filtered);
      setFilteredSeries(filtered);
    }
  }, [id_seccion, id_serie]);

  useEffect(() => {
    if (id_serie) {
      const filtered = subserie.filter((sub) => sub.id_serie === parseInt (id_serie));
      setFilteredSubseries(filtered);
      console.log('type of id_serie:', typeof id_serie);
    }
  }, [id_serie, id_subserie]);

  

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

  const handleback = () => {
    navigate("/Crear_Expediente");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !ficha.trim() ||
      !topologia.trim ()|| //Recien Agregado
      !area_resguardante.trim() ||
      !area_intervienen.trim() ||
      !descripcion.trim() ||
      !soporte_docu.trim() ||
      !id_seccion ||
      !id_serie
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
      ficha: ficha,
      area_resguardante: area_resguardante,
      area_intervienen: area_intervienen,
      soporte_docu: soporte_docu,
      descripcion: descripcion,
      topologia: topologia,
      catalogo: "",
      seccion: parseInt (id_seccion),
      serie: parseInt (id_serie),
      subserie: parseInt (id_subserie),
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
                            value={ficha}
                            onChange={(e) => setFicha(e.target.value)}
                          />
                          <label htmlFor="inputIdFicha">Nombre Ficha</label>
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

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputAreaIntervienen"
                            type="text"
                            placeholder="Tipología"
                            value={topologia}
                            onChange={(e) => setTopologia(e.target.value)}
                          />
                          <label htmlFor="inputTopologia">Tipología</label>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                id="inputSeccion"
                                type="text"
                                placeholder="Seccion"
                                value={seccionNombre}
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
                                onChange={(e) => {
                                  setIdSerie(e.target.value);
                                  setIdSubserie("");
                                }}
                              >
                                <option value="">Seleccione una opción</option>
                                {filteredSeries.map((s) => (
                                  <option key={s.serie} value={s.id_serie}>
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
                                {filteredSubseries.map((sub) => (
                                  <option
                                    key={sub.id_subserie}
                                    value={sub.id_subserie}
                                  >
                                    {sub.subserie}
                                  </option>
                                ))}
                              </select>
                              <label htmlFor="inputSubserie">ID Subserie</label>
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
            </div>
          </main>
        </div>
      </div>
    </body>
  );
}
