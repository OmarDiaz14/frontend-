import "../../styles/Styles.css";
import { Boton } from "../../components/Botones/Botones";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  destino_post,
  type_post,
  valor_post,
} from "../../services/catalogo.service";
import { useNavigate } from "react-router-dom";

export function DatosCatalogo() {
  const [destino, setDestiny] = useState("");
  const [type, setType] = useState("");
  const [valor, setValor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleback = () => {
    navigate("/home");
  };

  const handleSubmitDestiny = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!destino.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    const Destino = {
      destino: destino,
    };

    try {
      const result = await destino_post(Destino);
      console.log("Respuesta de la APi:", result);

      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Se ha agregado el destino con exito",
      });

      setDestiny("");
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Ooops",
        text: "Algo salio mal. Por favor intente de nuevo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitType = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!type.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    const Type = {
      type: type,
    };

    try {
      const result = await type_post(Type);
      console.log("Respuesta de la APi:", result);

      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Se ha agregado el tipo con exito",
      });

      setType("");
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Ooops",
        text: "Algo salio mal. Por favor intente de nuevo",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitValor = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    /*-----------------------Valor Post------------------------*/
    if (!valor.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Debes llenar todos los campos para enviar el formulario",
      });
      return;
    }
    setIsLoading(true);

    const Valor = {
      valores: valor,
    };

    try {
      const result = await valor_post(Valor);
      console.log("Respuesta de la APi:", result);

      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Se ha agregado el valor con exito",
      });

      setValor("");
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Ooops",
        text: "Algo salio mal. Por favor intente de nuevo",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="layoutAuthentication" style={{ paddingTop: "50px" }}>
      <div className="layoutAuthentication_content">
        <main>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-9 col-md-10 col-sm-12">
                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#171717", color: "#fff" }}
                  >
                    <h3
                      className="text-center font-weight-light my-4"
                      style={{ fontSize: "20px" }}
                    >
                      Destino del Expediente
                    </h3>
                  </div>
                  <div className="card-body">
                    <form action="" onSubmit={handleSubmitDestiny}>
                      <div className="row mb-3">
                        <div className="mb-3">
                          <label>
                            Ingrese los requeridos para catalogo
                            (Baja-Historico)
                          </label>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            type="text"
                            value={destino}
                            onChange={(e) => setDestiny(e.target.value)}
                          />
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

                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#171717", color: "#fff" }}
                  >
                    <h3
                      className="text-center font-weight-light my-4"
                      style={{ fontSize: "20px" }}
                    >
                      Tipo de Acceso
                    </h3>
                  </div>
                  <div className="card-body">
                    <form action="" onSubmit={handleSubmitType}>
                      <div className="row mb-3">
                        <div className="mb-3">
                          <label>
                            Ingrese los requeridos para catálogo (Reservado,
                            Público, Confidencial)
                          </label>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                          />
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

                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#171717", color: "#fff" }}
                  >
                    <h3
                      className="text-center font-weight-light my-4"
                      style={{ fontSize: "20px" }}
                    >
                      Valores Documentales
                    </h3>
                  </div>
                  <div className="card-body">
                    <form action="" onSubmit={handleSubmitValor}>
                      <div className="row mb-3">
                        <div className="mb-3">
                          <label>
                            Ingrese los requeridos para catálogo (Contable,
                            Físcal, Administrativo, Legal)
                          </label>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            type="text"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                          />
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
  );
}
