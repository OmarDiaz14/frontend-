import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate en lugar de useHistory
import "../../styles/Styles.css";
import Logo_Tlaxcala from "../../assets/Tlaxcala.png";
import Icono_Usuario from "../../assets/Usuario.png";
import Icono_Contraseña from "../../assets/Contraseña.png";
import { Boton } from "../../components/Botones/Botones";
import { login } from "../../services/auth.service"; // Importa la función de login
import Swal from "sweetalert2";

export function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita la recarga de la página
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, ingresa ambos campos",
      });
      return;
    }
    try {
      // Llama a la función de login y pasa username y password
      const { accessToken } = await login(username, password);
      console.log(accessToken);
      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Has iniciado sesión correctamente",
      });
      navigate("/Home"); // Redirige al usuario después del login exitoso
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
      <div className="Cabeza_Login">
        <img src={Logo_Tlaxcala} alt="Logo Tlaxcala" className="Estilo_Logo" />
        <div className="Titulo_Login">Iniciar Sesión</div>
        <div className="Linea_Divisora_Login"></div>
      </div>

      <form onSubmit={handleSubmit}>
        {" "}
        {/* Agrega el evento onSubmit */}
        <div className="Contenedor_Inputs">
          <div className="Input">
            <img src={Icono_Usuario} alt="Icono Usuario" />
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Actualiza el estado
            />
          </div>

          <div className="Input">
            <img src={Icono_Contraseña} alt="Icono Contraseña" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
            />
          </div>
        </div>
        {/* Muestra un mensaje de error si hay un problema con el login */}
        <div>
          <Boton>Entrar</Boton>
        </div>
      </form>
    </div>
  );
}
