import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ficha_get, ficha_put } from "../../services/ficha.services";
import { Boton } from "../../components/Botones/Botones";
import Swal from "sweetalert2";
import LogoImg from "../../assets/Tlaxcala.png";
import "../../styles/Styles.css";
import "sweetalert2/src/sweetalert2.scss";

interface Ficha {
  id_ficha: string;
  area_resguardante: string;
  area_intervienen: string;
  descripcion: string;
  soporte_docu: string;
  id_seccion: string;
  id_serie: string;
  id_subserie: string;
  topologia: string;
}

const INITIAL_FICHA: Ficha = {
  id_ficha: "",
  area_resguardante: "",
  area_intervienen: "",
  descripcion: "",
  soporte_docu: "",
  id_seccion: "",
  id_serie: "",
  id_subserie: "",
  topologia: "",
};

export const EditarFicha: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ficha, setFicha] = useState<Ficha>(INITIAL_FICHA);
  const [error, setError] = useState<string | null>(null);
  const [availableIds, setAvailableIds] = useState<string[]>([]);

  useEffect(() => {
    const loadFichaData = async () => {
      if (!id) {
        navigate("/Ficha");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await ficha_get();

        if (!response || response.length === 0) {
          throw new Error("No se encontraron fichas");
        }

        const ids = response.map((ficha: Ficha) => String(ficha.id_ficha));
        setAvailableIds(ids);

        const item = response.find(
          (ficha: Ficha) => String(ficha.id_ficha) === String(id)
        );

        if (!item) {
          await Swal.fire({
            icon: "error",
            title: "Ficha No Encontrada",
            text: `No se encontró la ficha con ID ${id}`,
            footer: `IDs disponibles: ${ids.join(", ")}`,
            confirmButtonText: "Volver a Fichas",
          });
          navigate("/Ficha");
          return;
        }

        setFicha(item);
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
          confirmButtonText: "Volver a Fichas",
        });

        navigate("/Ficha");
      } finally {
        setIsLoading(false);
      }
    };

    loadFichaData();
  }, [id, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Prevent changes to seccion, serie, and subserie IDs
    if (
      name === "id_seccion" ||
      name === "id_serie" ||
      name === "id_subserie" ||
      name === "id_ficha"
    ) {
      return;
    }
    setFicha((prev) => ({
      ...prev,
      [name]: value, // Allow spaces during editing
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof Ficha)[] = [
      "id_ficha",
      "area_resguardante",
      "area_intervienen",
      "descripcion",
      "soporte_docu",
      "topologia",
    ];

    const emptyFields = requiredFields.filter((field) => {
      const value = ficha[field];
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
        text: "ID de la ficha no encontrado",
      });
      navigate("/Ficha");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Trim values only when submitting
      const trimmedFicha = Object.fromEntries(
        Object.entries(ficha).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      ) as Ficha;

      const result = await ficha_put(id, trimmedFicha);

      if (result) {
        await Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Ficha actualizada correctamente",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/Ficha");
      } else {
        throw new Error("No se pudo actualizar la ficha");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      console.error("Error en actualización:", error);
      setError(errorMessage);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al actualizar la ficha: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (
    name: keyof Ficha,
    label: string,
    type: "text" | "textarea" = "text"
  ) => {
    // Check if field should be read-only
    const isReadOnly =
      name === "id_seccion" ||
      name === "id_serie" ||
      name === "id_subserie" ||
      name === "id_ficha";

    if (type === "textarea") {
      return (
        <div className="form-floating mb-3">
          <textarea
            className={`form-control ${isReadOnly ? "bg-light" : ""}`}
            name={name}
            value={ficha[name] ?? ""}
            onChange={handleInputChange}
            placeholder={label}
            readOnly={isReadOnly}
          />
          <label>{label}</label>
        </div>
      );
    }

    return (
      <div className="form-floating mb-3">
        <input
          className={`form-control ${isReadOnly ? "bg-light" : ""}`}
          type="text"
          name={name}
          value={ficha[name] ?? ""}
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
                        Editar Ficha Técnica
                      </h3>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        {renderFormField("id_ficha", "ID Ficha")}

                        {renderFormField(
                          "area_resguardante",
                          "Área Resguardante",
                          "textarea"
                        )}

                        {renderFormField(
                          "area_intervienen",
                          "Áreas que Intervienen",
                          "textarea"
                        )}

                        {renderFormField(
                          "descripcion",
                          "Descripción",
                          "textarea"
                        )}

                        {renderFormField("soporte_docu", "Soporte Documental")}

                        {renderFormField("topologia", "Tipología", "textarea")}

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
    </div>
  );
};

export default EditarFicha;
