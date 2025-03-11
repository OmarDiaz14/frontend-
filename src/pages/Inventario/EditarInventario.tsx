import { Boton } from "../../components/Botones/Botones";
import Logo from "../../assets/Tlaxcala.png";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  inventario_get,
  inventario_put,
} from "../../services/inventario.services";
import Swal from "sweetalert2";

interface Inventario {
  acceso: string;
  descripsion: string;
  destino: string;
  expediente: string;
  fecha_fin: string;
  fecha_inicio: string;
  fojas: string;
  legajos: string;
  num_consecutivo: string;
  num_expediente: string;
  observaciones: string;
  serie: string;
  soporte: string;
  valores_primarios: string;
}

const INITIAL_INVENTARIO: Inventario = {
  acceso: "",
  descripsion: "",
  destino: "",
  expediente: "",
  fecha_fin: "",
  fecha_inicio: "",
  fojas: "",
  legajos: "",
  num_consecutivo: "",
  num_expediente: "",
  observaciones: "",
  serie: "",
  soporte: "",
  valores_primarios: "",
};
export const EditarInventario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [inventario, setInventario] = useState<Inventario>(INITIAL_INVENTARIO);
  const [error, setError] = useState<string | null>(null);
  const [availableIds, setAvailableIds] = useState<string[]>([]);

  const handleback = () => {
    navigate("/InventoryAuth");
  };

  useEffect(() => {
    const loadInventarioData = async () => {
      if (!id) {
        navigate("/InventoryAuth");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await inventario_get();

        if (!response || response.length === 0) {
          throw new Error("No se encontraron portadas");
        }

        const ids = response.map((port: Inventario) =>
          String(port.num_consecutivo)
        );
        setAvailableIds(ids);

        const item = response.find(
          (port: Inventario) => String(port.num_consecutivo) === String(id)
        );

        if (!item) {
          await Swal.fire({
            icon: "error",
            title: "Inventario No Encontrado",
            text: `No se encontró el inventario con ID ${id}`,
            footer: `IDs disponibles: ${ids.join(", ")}`,
            confirmButtonText: "Volver a Autorización Inventario",
          });
          navigate("/InventoryAuth");
          return;
        }

        setInventario(item);
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
          confirmButtonText: "Volver a Autorización de Inventario",
        });
        navigate("/InventoryAuth");
      } finally {
        setIsLoading(false);
      }
    };

    loadInventarioData();
  }, [id, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "descripsion" || name === "observaciones") {
      setInventario((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!inventario.descripsion?.trim() || !inventario.observaciones?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Descripción y observaciones son obligatorios",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError(null);

      const updatePayload = {
        expediente: inventario.expediente,
        serie: inventario.serie,
        descripsion: inventario.descripsion.trim(),
        observaciones: inventario.observaciones.trim(),
      };
      console.log("Full request details:", {
        id: inventario.expediente,
        payload: updatePayload,
      });

      const result = await inventario_put(
        inventario.num_consecutivo,
        updatePayload
      );
      console.log("API Response:", result);
      console.log("Expediente:", inventario.expediente);
      console.log("Payload:", updatePayload);

      if (result) {
        await Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Portada actualizada correctamente",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/InventoryAuth");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error en actualización:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al actualizar el inventario: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderReadOnlyField = (label: string, value: string) => (
    <div className="form-floating mb-3">
      <input
        className="form-control bg-light"
        type="text"
        value={value}
        readOnly
        placeholder={label}
      />
      <label>{label}</label>
    </div>
  );

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
                      Editar Portada de Expediente
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "ID de Expediente",
                            inventario.expediente
                          )}
                        </div>
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Número de Expediente",
                            inventario.num_expediente
                          )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Número de Serie",
                            inventario.serie
                          )}
                        </div>
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Fecha de inicio",
                            inventario.fecha_inicio
                          )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Fecha de fin",
                            inventario.fecha_fin
                          )}
                        </div>
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Número de legajos",
                            inventario.legajos
                          )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Número de fojas",
                            inventario.fojas
                          )}
                        </div>
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Valores Primarios",
                            inventario.valores_primarios
                          )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Soporte Documental",
                            inventario.soporte
                          )}
                        </div>
                        <div className="col-md-6">
                          {renderReadOnlyField(
                            "Destino del Expediente",
                            inventario.destino
                          )}
                        </div>
                      </div>
                      <div className="col-mb3">
                        {renderReadOnlyField(
                          "Tipo de Acceso",
                          inventario.acceso
                        )}
                      </div>

                      <div className="form-floating mb-3">
                        <textarea
                          className="form-control"
                          name="descripsion"
                          value={inventario.descripsion}
                          onChange={handleInputChange}
                          placeholder="Descripción"
                        />
                        <label>Descripción</label>
                      </div>

                      <div className="form-floating mb-3">
                        <textarea
                          className="form-control"
                          name="observaciones"
                          value={inventario.observaciones}
                          onChange={handleInputChange}
                          placeholder="Observaciones"
                        />
                        <label>Observaciones</label>
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

export default EditarInventario;
