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
import Swal from "sweetalert2";
import LogoImg from "../../assets/Tlaxcala.png";
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
  id_seccion: string;
  id_serie: string;
  id_subserie: string;
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
  id_seccion: "",
  id_serie: "",
  id_subserie: "",
};

export const EditarCatalogo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [catalogo, setCatalogo] = useState<CatalogoBase>(INITIAL_CATALOGO);
  const [destinos, setDestinos] = useState<destino[]>([]);
  const [tipos, setTipos] = useState<type[]>([]);
  const [valores, setValores] = useState<valor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fullCatalogoList, setFullCatalogoList] = useState<CatalogoWithId[]>(
    []
  );

  useEffect(() => {
    const loadCatalogData = async () => {
      if (!id) {
        navigate("/Catálogo");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log("ID del catálogo buscado:", id);
        console.log("Tipo de ID:", typeof id);

        const response = await catalogo_get();

        if (!response) {
          throw new Error("No se pudieron cargar los catálogos");
        }

        console.log(
          "Lista completa de catálogos:",
          JSON.stringify(response, null, 2)
        );

        const availableIds = response.map(
          (cat: CatalogoWithId) => cat.id_catalogo
        );
        console.log("IDs disponibles:", availableIds);

        const item = response.find(
          (cat: CatalogoWithId) =>
            cat.id_catalogo === id ||
            cat.id_catalogo === String(id) ||
            cat.id_catalogo == id
        );

        if (!item) {
          console.error("Ningún catálogo coincide con este ID", {
            searchId: id,
            availableIds,
          });
          throw new Error(`Catálogo con ID ${id} no encontrado`);
        }

        console.log("Catálogo encontrado:", JSON.stringify(item, null, 2));

        const { id_catalogo, ...catalogoBase } = item;
        setCatalogo(catalogoBase);
        setFullCatalogoList(response);

        const [destinosData, tiposData, valoresData] = await Promise.all([
          destino_get(),
          type_get(),
          valor_get(),
        ]);

        setDestinos(destinosData || []);
        setTipos(tiposData || []);
        setValores(valoresData || []);
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
    setCatalogo((prev) => ({
      ...prev,
      [name]: value, // Eliminado .trim()
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

      console.log(
        "Datos a actualizar:",
        JSON.stringify(catalogoToUpdate, null, 2)
      );

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
            name === "id_seccion" ||
            name === "id_serie" ||
            name === "id_subserie" ||
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
                        Editar Catálogo de Disposición Documental
                      </h3>
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
                            {renderFormField("id_seccion", "ID Sección")}
                          </div>
                          <div className="col-md-4">
                            {renderFormField("id_serie", "ID Serie")}
                          </div>
                          <div className="col-md-4">
                            {renderFormField("id_subserie", "ID Subserie")}
                          </div>
                        </div>

                        <div className="mt-4 mb-0">
                          <div className="d-grid">
                            <Boton type="submit" disabled={isLoading}>
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
    </body>
  );
};
