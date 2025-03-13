import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Styles.css";
import MBN from "../../assets/MBN.png";
import Icono_Usuario from "../../assets/Usuario.png";
import Icono_Contraseña from "../../assets/Contraseña.png";
import { Boton } from "../../components/Botones/Botones";
import { login } from "../../services/auth.service";
import Swal from "sweetalert2";

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const hasShownWelcome = localStorage.getItem("hasShownWelcome") === "true";
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, ingresa ambos campos",
      });
      return;
    }
    try {
      const { accessToken } = await login(username, password);
      console.log(accessToken);

      if (!hasShownWelcome) {
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Has iniciado sesión correctamente",
        });
        localStorage.setItem("hasShownWelcome", "true");
      }
      navigate("/Home");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor verifique sus credenciales",
      });
    }
  };

  return (
    <div className="Contenedor_Login">
      <div className="contenedor_login">
        <main>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="Cabeza_Login">
                  <img src={MBN} alt="Logo Tlaxcala" className="Estilo_Logo" />
                  <div className="Titulo_Login">Iniciar Sesión</div>
                  <div className="Linea_Divisora_Login"></div>
                </div>

                <form onSubmit={handleSubmit}>
                  {" "}
                  <div className="Contenedor_Inputs">
                    <div className="Input">
                      <img src={Icono_Usuario} alt="Icono Usuario" />
                      <input
                        type="text"
                        placeholder="Nombre de Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div className="Input">
                      <img src={Icono_Contraseña} alt="Icono Contraseña" />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Boton>Entrar</Boton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
