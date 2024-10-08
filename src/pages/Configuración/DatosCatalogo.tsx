import "../../Styles/Styles.css";
import Logo from "../../assets/Tlaxcala.png";
import { Boton } from "../../components/Botones/Botones";
import { useState } from "react";
import Swal from "sweetalert2";

export function DatosCatalogo() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <body>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      ></link>
      <img className="Logo_imgRU" src={Logo} alt="" width={"25%"} />
      <h3 className="text-center font-weight-light my-4">
        Datos adicionales del Catálogo
      </h3>
      <div className="layoutAuthentication">
        <div className="layoutAuthentication_content">
          <main>
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-lg-7">
                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header">
                      <h3 className="text-center font-weight-light my-4">
                        Destino del Expediente
                      </h3>
                    </div>
                    <div className="card-body">
                      <form action="">
                        <div className="row mb-3">
                          <div className=" mb-3">
                            <label>
                              Ingrese los requeridos para catalogo
                              (Baja-Historico)
                            </label>
                          </div>

                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              id="inputDestiny"
                              type="text"
                              placeholder="Destino del usuario"
                            />
                            <label htmlFor="inputDestiny">
                              Baja / Historico
                            </label>
                          </div>
                        </div>

                        <div className="">
                          <Boton disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar"}
                          </Boton>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header">
                      <h3 className="text-center font-weight-light my-4">
                        Tipo de acceso
                      </h3>
                    </div>
                    <div className="card-body">
                      <form action="">
                        <div className="row mb-3">
                          <div className=" mb-3">
                            <label>
                              Ingrese los requeridos para catalogo (Reservado,
                              Público, Confidencial)
                            </label>
                          </div>

                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              id="inputAccess"
                              type="text"
                              placeholder="Destino del usuario"
                            />
                            <label htmlFor="inputAccess">
                              Reservado / Público / Confidencial
                            </label>
                          </div>
                        </div>

                        <div className="">
                          <Boton disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar"}
                          </Boton>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="card shadow-lg border-0 rounded-lg mt-5">
                    <div className="card-header">
                      <h3 className="text-center font-weight-light my-4">
                        Valores Documentales
                      </h3>
                    </div>
                    <div className="card-body">
                      <form action="">
                        <div className="row mb-3">
                          <div className=" mb-3">
                            <label>
                              Ingrese los requeridos para catalogo (Contable,
                              Físcal, Administrativo, Legal)
                            </label>
                          </div>

                          <div className="form-floating mb-3">
                            <input
                              className="form-control"
                              id="inputValores"
                              type="text"
                              placeholder="Destino del usuario"
                            />
                            <label htmlFor="inputValores">
                              Contable / Físcal / Administrativo /Legal
                            </label>
                          </div>
                        </div>

                        <div className="">
                          <Boton disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar"}
                          </Boton>
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
