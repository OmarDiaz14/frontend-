import Logo from "../../assets/Tlaxcala.png";
import { TableInventory } from "../Inventario/TableInventario";

export function Inventory() {
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
<<<<<<< HEAD
              <div className="row ">
                <div className="col-lg-4"></div>
=======
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
                              {isLoading ? "Creando..." : "Crear"}
                            </Boton>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
>>>>>>> e227e409d23a9b5e87a7422d5dab5a1934493894
              </div>
              <TableInventory></TableInventory>
            </div>
          </main>
        </div>
      </div>
    </body>
  );
}
