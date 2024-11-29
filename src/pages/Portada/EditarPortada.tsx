import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { portada_get, portada_put } from "../../services/portada.services";
import { Boton } from "../../components/Botones/Botones";
import Swal from "sweetalert2";
import LogoImg from "../../assets/Tlaxcala.png";
import "../../styles/Styles.css";
import "sweetalert2/src/sweetalert2.scss";

interface Portada {
  num_expediente: string;
  asunto: string;
  num_legajos: string;
  num_fojas: string;
  valores_secundarios: string;
  fecha_apertura: string;
  fecha_cierre: string;
  seccion: string;
  serie: string;
  subserie: string;
  ficha: string;
  catalogo: string;
  id_expediente?: string;
}

const INITIAL_PORTADA: Portada = {
  num_expediente: "",
  asunto: "",
  num_legajos: "",
  num_fojas: "",
  valores_secundarios: "",
  fecha_apertura: "",
  fecha_cierre: "",
  seccion: "",
  serie: "",
  subserie: "",
  ficha: "",
  catalogo: "",
};

export const EditarPortada: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [portada, setPortada] = useState<Portada>(INITIAL_PORTADA);
  const [error, setError] = useState<string | null>(null);
  const [availableIds, setAvailableIds] = useState<string[]>([]);

  useEffect(() => {
    const loadPortadaData = async () => {
      if (!id) {
        navigate("/Portada");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await portada_get();

        if (!response || response.length === 0) {
          throw new Error("No se encontraron portadas");
        }

        const ids = response.map((port: Portada) => String(port.id_expediente));
        setAvailableIds(ids);

        const item = response.find(
          (port: Portada) => String(port.id_expediente) === String(id)
        );

        if (!item) {
          await Swal.fire({
            icon: "error",
            title: "Portada No Encontrada",
            text: `No se encontró la portada con ID ${id}`,
            footer: `IDs disponibles: ${ids.join(", ")}`,
            confirmButtonText: "Volver a Portadas",
          });
          navigate("/Portada");
          return;
        }

        setPortada(item);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al cargar datos";

        console.error("Error al cargar datos:", error);
        setError(errorMessage);

        await Swal.fire({
          icon: "error",
          title: "Error de Carga",
          text: errorMessage,
          confirmButtonText: "Volver a Portadas",
        });

        navigate("/Portada");
      } finally {
        setIsLoading(false);
      }
    };

    loadPortadaData();
  }, [id, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "seccion" || name === "serie" || name === "subserie") {
      return;
    }
    setPortada((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof Portada)[] = [
      "num_expediente",
      "asunto",
      "fecha_apertura",
      "fecha_cierre",
      "ficha",
      "catalogo",
      "num_legajos",
      "num_fojas",
      "valores_secundarios",
    ];

    const emptyFields = requiredFields.filter((field) => {
      const value = portada[field];
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
        text: "ID de la portada no encontrado",
      });
      navigate("/Portada");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Trim values only when submitting
      const trimmedPortada = Object.fromEntries(
        Object.entries(portada).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      ) as Portada;

      const result = await portada_put(id, trimmedPortada);

      if (result) {
        await Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Portada actualizada correctamente",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/Portada");
      } else {
        throw new Error("No se pudo actualizar la portada");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      console.error("Error en actualización:", error);
      setError(errorMessage);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al actualizar la portada: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (
    name: keyof Portada,
    label: string,
    type: "text" | "date" = "text"
  ) => {
    const isReadOnly =
      name === "seccion" ||
      name === "serie" ||
      name === "subserie" ||
      name === "num_expediente" ||
      name === "ficha" ||
      name === "fecha_apertura" ||
      name === "catalogo" ||
      name === "valores_secundarios";

    return (
      <div className="form-floating mb-3">
        <input
          className={`form-control ${isReadOnly ? "bg-light" : ""}`}
          type={type}
          name={name}
          value={portada[name] ?? ""}
          onChange={handleInputChange}
          placeholder={label}
          readOnly={isReadOnly}
        />
        <label>{label}</label>
      </div>
    );
  };

  return (
    <div>
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
                        Editar Portada de Expediente
                      </h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            {renderFormField(
                              "num_expediente",
                              "No. Expediente"
                            )}
                          </div>
                          <div className="col-md-6">
                            {renderFormField("ficha", "Ficha")}
                          </div>
                        </div>

                        <div className="form-floating mb-3">
                          <textarea
                            className="form-control"
                            name="asunto"
                            value={portada.asunto ?? ""}
                            onChange={handleInputChange}
                            placeholder="Asunto"
                          />
                          <label>Asunto</label>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            {renderFormField(
                              "fecha_apertura",
                              "Fecha de Apertura",
                              "date"
                            )}
                          </div>
                          <div className="col-md-6">
                            {renderFormField(
                              "fecha_cierre",
                              "Fecha de Cierre",
                              "date"
                            )}
                          </div>
                        </div>

                        <div className="form-floating mb-3">
                          {renderFormField("catalogo", "Catálogo")}
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            {renderFormField("num_legajos", "No. Legajos")}
                          </div>
                          <div className="col-md-4">
                            {renderFormField("num_fojas", "No. Fojas")}
                          </div>
                          <div className="col-md-4">
                            {renderFormField(
                              "valores_secundarios",
                              "Valores Secundarios"
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            {renderFormField("seccion", "Sección")}
                          </div>
                          <div className="col-md-4">
                            {renderFormField("serie", "Serie")}
                          </div>
                          <div className="col-md-4">
                            {renderFormField("subserie", "Subserie")}
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
    </div>
  );
};

export default EditarPortada;
