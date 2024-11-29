import React, { useEffect, useState } from "react";
import { invetario_post } from "../../services/inventario.services";
import { Inventario } from "../../services/var.inven";
import { Portada } from "../../services/var.portada";
import { serie } from "../../Producto";
import { portada_get } from "../../services/portada.services";
import { serie_get } from "../../services/cuadro.service";
import { getUser } from "../../services/auth.service";
import Swal from "sweetalert2";
import { Boton } from "../../components/Botones/Botones";
import Logo from "../../assets/Tlaxcala.png";
import { TableInventory } from "../Inventario/TableInventario";

export function Inventory() {
  const initialUserState = new Inventario();
  const [inventario, setInventario] = useState<Inventario>(initialUserState);

  const [refreshTable, setRefreshTable] = useState(0);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setInventario((prevInventario) => ({
      ...prevInventario,
      [name]: value,
    }));
  };

  const [filteredSeries, setFilteredSeries] = useState<serie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Portada, setPortada] = useState<Portada[]>([]);
  const [Serie, setSerie] = useState<serie[]>([]);

  useEffect(() => {
    const user = getUser();
    if (user && user.unidad_admi) {
      const filtered = Serie.filter((s) => s.id_seccion === user.unidad_admi);
      setFilteredSeries(filtered);

      if (filtered.length === 1) {
        setInventario((prev) => ({
          ...prev,
          serie: filtered[0].serie,
        }));
      }
    }
  }, [Serie]);

  useEffect(() => {
    const fetchPortada = async () => {
      const items = await portada_get();
      setPortada(items);
    };
    fetchPortada();
  }, []);

  useEffect(() => {
    const fetchSerie = async () => {
      const items = await serie_get();
      setSerie(items);
    };
    fetchSerie();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !inventario.descripsion.trim() ||
      !inventario.estatus.trim() ||
      !inventario.expediente.trim() ||
      !inventario.observaciones.trim() ||
      !inventario.serie.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    try {
      const result = await invetario_post(inventario);
      console.log("Respuesta de la API;", result);
      Swal.fire({
        icon: "success",
        title: "Exito",
        text: "El inventario se ha creado correctamente",
        timer: 1500,
        showConfirmButton: false,
      });

      setRefreshTable((prev) => prev + 1);

      setInventario(initialUserState);
    } catch (error) {
      console.log("Error", error);

      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Algo salió mal, intenta de nuevo",
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
      ></link>
      <img className="Logo_imgRU" src={Logo} alt="" width={"25%"} />
      <div className="layoutAuthentication">
        <div className="layoutAuthentication_content">
          <main>
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header">
                      {" "}
                      <h3 className="text-center font-weight-light my-4">
                        {" "}
                        Inventario General
                      </h3>
                    </div>
                    <div className="card-body">
                      <form action="" onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <select
                                className="multisteps-form_input form-select"
                                id="UA"
                                value={inventario.serie}
                                onChange={handleInputChange}
                                name="serie"
                              >
                                <option value="">Seleccione la Serie</option>
                                {filteredSeries.map((serie) => (
                                  <option value={serie.serie}>
                                    {serie.serie}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                id="inputCargo"
                                type="text"
                                placeholder="Coloca el cargo"
                                value={inventario.descripsion}
                                onChange={handleInputChange}
                                name="descripsion"
                              />
                              <label htmlFor="input Cargo">Descripcion</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <select
                                className="multisteps-form_input form-select"
                                id="roles"
                                value={inventario.estatus}
                                onChange={handleInputChange}
                                name="estatus"
                              >
                                <option>
                                  Seleccione el Status del Expediente
                                </option>
                                <option value="abierto">Abierto</option>
                                <option value="cerrado">Cerrado</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-floating">
                              <input
                                className="form-control"
                                id="inputEmail"
                                type="text"
                                placeholder="Observaciones"
                                value={inventario.observaciones}
                                onChange={handleInputChange}
                                name="observaciones"
                              />
                              <label htmlFor="inputEmail">Observaciones</label>
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-floating">
                              <select
                                className="multisteps-form_input form-select"
                                id="UA"
                                value={inventario.expediente}
                                onChange={handleInputChange}
                                name="expediente"
                              >
                                <option value="">
                                  Seleccione el expediente
                                </option>
                                {Portada.map((portada) => (
                                  <option value={portada.id_expediente}>
                                    {portada.num_expediente}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="">
                          <div className="">
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
              <TableInventory key={refreshTable}></TableInventory>
            </div>
          </main>
        </div>
      </div>
    </body>
  );
}
