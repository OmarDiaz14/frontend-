import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ficha_get, ficha_put } from "../../services/ficha.services";
import {
  Seccion_get,
  serie_get,
  subserie_get,
} from "../../services/cuadro.service";
import { seccion, serie, SubSerie } from "../../services/var.cuadro";
import { Boton } from "../../components/Botones/Botones";
import Swal from "sweetalert2";
import "../../styles/Styles.css";
import "sweetalert2/src/sweetalert2.scss";

interface Ficha {
  id_ficha: string | number;
  ficha: string;
  area_resguardante: string;
  area_intervienen: string;
  descripcion: string;
  soporte_docu: string;
  seccion: string | number;
  serie: string | number;
  subserie: number | null; // Permitir que subserie sea null
  topologia: string;
  catalogo: string;
  nombre_seccion?: string | null;
  nombre_serie?: string | null;
  nombre_subserie?: string | null;
}

const INITIAL_FICHA: Ficha = {
  id_ficha: "",
  ficha: "",
  area_resguardante: "",
  area_intervienen: "",
  descripcion: "",
  soporte_docu: "",
  seccion: "",
  serie: "",
  subserie: null, // Inicializar subserie como null
  topologia: "",
  catalogo: "",
};

export const EditarFicha: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ficha, setFicha] = useState<Ficha>(INITIAL_FICHA);
  const [error, setError] = useState<string | null>(null);
  const [availableIds, setAvailableIds] = useState<string[]>([]);

  const handleback = () => {
    navigate("/Ficha");
  };

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

        const seccionResponse = await Seccion_get();
        const serieResponse = await serie_get();
        const subserieResponse = await subserie_get();

        const nombreSeccion = seccionResponse.find(
          (seccion: seccion) =>
            String(seccion.id_seccion) === String(item.seccion)
        )?.seccion;

        const nombreSerie = serieResponse.find(
          (serie: serie) => String(serie.id_serie) === String(item.serie)
        )?.serie;

        const nombreSubserie = subserieResponse.find(
          (subserie: SubSerie) =>
            String(subserie.id_subserie) === String(item.subserie)
        )?.subserie;

        setFicha({
          ...item,
          nombre_seccion: nombreSeccion || null,
          nombre_serie: nombreSerie || null,
          nombre_subserie: nombreSubserie || null,
        });
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
      [name]: value,
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

      const trimmedFicha = Object.fromEntries(
        Object.entries(ficha).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      ) as Ficha;

      const dataToSend: any = {
        ...trimmedFicha,
        seccion: Number(trimmedFicha.seccion),
        serie: Number(trimmedFicha.serie),
      };

      if (trimmedFicha.subserie !== null && trimmedFicha.subserie !== 0) {
        dataToSend.subserie = Number(trimmedFicha.subserie);
      }

      const result = await ficha_put(id, dataToSend);

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
    const isReadOnly =
      name === "seccion" ||
      name === "serie" ||
      name === "subserie" ||
      name === "id_ficha";

    const displayValue =
      name === "seccion" && ficha.nombre_seccion !== null
        ? ficha.nombre_seccion
        : name === "serie" && ficha.nombre_serie !== null
        ? ficha.nombre_serie
        : name === "subserie" && ficha.nombre_subserie !== null
        ? ficha.nombre_subserie
        : ficha[name] ?? "";

    if (type === "textarea") {
      return (
        <div className="form-floating mb-3">
          <textarea
            className={`form-control ${isReadOnly ? "bg-light" : ""}`}
            name={name}
            value={displayValue}
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
          value={displayValue}
          onChange={handleInputChange}
          placeholder={label}
          readOnly={isReadOnly}
        />
        <label>{label}</label>
      </div>
    );
  };
  return (
    <div className="layoutAuthentication" style={{ paddingTop: "50px " }}>
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
                      Editar Ficha Técnica
                    </h5>
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
                          {renderFormField("seccion", "ID Sección")}
                        </div>
                        <div className="col-md-4">
                          {renderFormField("serie", "ID Serie")}
                        </div>
                        <div className="col-md-4">
                          {renderFormField("subserie", "ID Subserie")}
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

export default EditarFicha;
