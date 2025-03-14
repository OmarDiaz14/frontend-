import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  catalogo_get,
  catalogo_put,
  destino_get,
  type_get,
  valor_get,
} from "../../services/catalogo.service";
import { Boton } from "../../components/Botones/Botones";
import { destino, type, valor } from "../../services/var.catalogo";
import {
  Seccion_get,
  serie_get,
  subserie_get,
} from "../../services/cuadro.service";
import { seccion, serie, SubSerie } from "../../services/var.cuadro";
import Swal from "sweetalert2";
import "../../styles/Styles.css";
import "sweetalert2/src/sweetalert2.scss";

interface CatalogoBase {
  catalogo: string;
  archivo_tramite: string;
  archivo_concentracion: string;
  destino_expe: string;
  type_access: string;
  valores_documentales: string;
  observaciones: string;
  seccion: number; // Asegúrate de que sea number
  serie: number; // Asegúrate de que sea number
  subserie: number; // Asegúrate de que sea number
}

interface CatalogoWithId extends CatalogoBase {
  id_catalogo: string;
}

const INITIAL_CATALOGO: CatalogoBase = {
  catalogo: "",
  archivo_tramite: "",
  archivo_concentracion: "",
  destino_expe: "",
  type_access: "",
  valores_documentales: "",
  observaciones: "",
  seccion: 0,
  serie: 0,
  subserie: 0,
};

export const EditarCatalogo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [catalogo, setCatalogo] = useState<CatalogoBase>(INITIAL_CATALOGO);
  const [destinos, setDestinos] = useState<destino[]>([]);
  const [tipos, setTipos] = useState<type[]>([]);
  const [valores, setValores] = useState<valor[]>([]);
  const [secciones, setSecciones] = useState<seccion[]>([]);
  const [series, setSeries] = useState<serie[]>([]);
  const [subseries, setSubseries] = useState<SubSerie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fullCatalogoList, setFullCatalogoList] = useState<CatalogoWithId[]>(
    []
  );

  const handleback = () => {
    navigate("/Catálogo");
  };

  useEffect(() => {
    const loadCatalogData = async () => {
      if (!id) {
        navigate("/Catálogo");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await catalogo_get();

        if (!response) {
          throw new Error("No se pudieron cargar los catálogos");
        }

        const item = response.find(
          (cat: CatalogoWithId) =>
            cat.id_catalogo === id ||
            cat.id_catalogo === String(id) ||
            cat.id_catalogo == id
        );

        if (!item) {
          throw new Error(`Catálogo con ID ${id} no encontrado`);
        }

        const { id_catalogo, ...catalogoBase } = item;
        setCatalogo(catalogoBase);
        setFullCatalogoList(response);

        const [
          destinosData,
          tiposData,
          valoresData,
          seccionesData,
          seriesData,
          subseriesData,
        ] = await Promise.all([
          destino_get(),
          type_get(),
          valor_get(),
          Seccion_get(),
          serie_get(),
          subserie_get(),
        ]);

        setDestinos(destinosData || []);
        setTipos(tiposData || []);
        setValores(valoresData || []);
        setSecciones(seccionesData || []);
        setSeries(seriesData || []);
        setSubseries(subseriesData || []);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al cargar datos";

        console.error("Error completo al cargar datos:", error);

        setError(errorMessage);

        await Swal.fire({
          icon: "error",
          title: "Error de Carga",
          text: `No se pudo cargar el catálogo: ${errorMessage}`,
          confirmButtonText: "Volver a Catálogos",
        });

        navigate("/Catálogo");
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalogData();
  }, [id, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Convertir a number si el campo es numérico
    const numericFields = ["seccion", "serie", "subserie"];
    const parsedValue = numericFields.includes(name) ? Number(value) : value;

    setCatalogo((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof CatalogoBase)[] = [
      "catalogo",
      "archivo_tramite",
      "archivo_concentracion",
      "destino_expe",
      "type_access",
      "valores_documentales",
      "observaciones",
    ];

    const emptyFields = requiredFields.filter((field) => {
      const value = catalogo[field];
      return (
        value === undefined || value === null || String(value).trim() === ""
      );
    });

    if (emptyFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: `Los siguientes campos son obligatorios: ${emptyFields.join(
          ", "
        )}`,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID del catálogo no encontrado",
      });
      navigate("/Catálogo");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const catalogoToUpdate: CatalogoWithId = {
        ...catalogo,
        id_catalogo: id,
      };

      await catalogo_put(id, catalogoToUpdate);

      await Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Catálogo actualizado correctamente",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/Catálogo");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error en actualización:", error);
      setError(errorMessage);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al actualizar el catálogo: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (
    name: keyof CatalogoBase,
    label: string,
    type: "text" | "select" = "text",
    options?: { id: string; value: string }[]
  ) => (
    <div className="form-floating">
      {type === "text" ? (
        <input
          className="form-control"
          type="text"
          name={name}
          value={catalogo[name]}
          onChange={handleInputChange}
          placeholder={label}
          disabled={
            name === "seccion" ||
            name === "serie" ||
            name === "subserie" ||
            name === "catalogo" ||
            name === "archivo_tramite"
          }
        />
      ) : (
        <select
          className="form-control form-select"
          name={name}
          value={catalogo[name]}
          onChange={handleInputChange}
        >
          <option value="">Seleccione una opción</option>
          {options?.map((option) => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
      )}
      <label>{label}</label>
    </div>
  );

  if (isLoading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <details>
            <summary>Detalles de los catálogos</summary>
            <pre>{JSON.stringify(fullCatalogoList, null, 2)}</pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="layoutAuthentication" style={{ paddingTop: "50px" }}>
      <div className="layoutAuthentication_content">
        <main>
          <div className="container-fluid">
            <div className="row justify-content-center">
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
                      Editar Catálogo de Disposición Documental
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          {renderFormField("catalogo", "Nombre del Catálogo")}
                        </div>
                        <div className="col-md-6">
                          {renderFormField(
                            "valores_documentales",
                            "Valores Documentales",
                            "select",
                            valores.map((v) => ({
                              id: v.id_valores,
                              value: v.valores,
                            }))
                          )}
                        </div>
                      </div>

                      <div className="form-floating mb-3">
                        {renderFormField("observaciones", "Observaciones")}
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          {renderFormField(
                            "archivo_tramite",
                            "Archivo de Trámite"
                          )}
                        </div>
                        <div className="col-md-6">
                          {renderFormField(
                            "archivo_concentracion",
                            "Archivo de Concentración"
                          )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          {renderFormField(
                            "type_access",
                            "Tipo de Acceso",
                            "select",
                            tipos.map((t) => ({
                              id: t.id_type,
                              value: t.type,
                            }))
                          )}
                        </div>
                        <div className="col-md-6">
                          {renderFormField(
                            "destino_expe",
                            "Destino del expediente",
                            "select",
                            destinos.map((d) => ({
                              id: d.id_destino,
                              value: d.destino,
                            }))
                          )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-4">
                          {renderFormField(
                            "seccion",
                            "Sección",
                            "select",
                            secciones.map((s) => ({
                              id: s.id_seccion.toString(),
                              value: s.seccion,
                            }))
                          )}
                        </div>
                        <div className="col-md-4">
                          {renderFormField(
                            "serie",
                            "Serie",
                            "select",
                            series.map((s) => ({
                              id: s.id_serie.toString(),
                              value: s.serie,
                            }))
                          )}
                        </div>
                        <div className="col-md-4">
                          {renderFormField(
                            "subserie",
                            "Subserie",
                            "select",
                            subseries.map((s) => ({
                              id: s.id_subserie.toString(),
                              value: s.subserie,
                            }))
                          )}
                        </div>
                      </div>

                      <div className="d-flex justify-content-center gap-4 mt-4 mb-2">
                        <div className="mx-2">
                          <Boton onClick={handleback}>Atrás</Boton>
                        </div>
                        <div className="mx-2">
                          <Boton disabled={isLoading}>
                            {isLoading ? "Actualizando..." : "Actualizar"}
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
};
