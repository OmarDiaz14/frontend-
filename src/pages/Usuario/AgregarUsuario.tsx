import "../../styles/Styles.css";

import { Boton } from "../../components/Botones/Botones";
import React, { useEffect, useState } from "react";
import { user_post } from "../../services/user.services";
import { User } from "../../services/var.user.services";
import Swal from "sweetalert2";
import { seccion } from "../../services/var.cuadro";
import { Seccion_get } from "../../services/cuadro.service";
import { Roles } from "../../models/enums/roles_enum";
import { useNavigate } from "react-router-dom";

export function AgregarUsuario() {
  const navigate = useNavigate();
  const initialUserState = new User();
  const [user, setUser] = useState<User>(initialUserState);
  const [selectedSeccionName, setSelectedSeccionName] = useState<string>("");
  const [Repass, setRepass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secciones, setSeccion] = useState<seccion[]>([]);

  useEffect(() => {
    const fetchSecciones = async () => {
      const items = await Seccion_get();
      setSeccion(items);
    };
    fetchSecciones();
  }, []);

  const handleback = () => {
    navigate("/Home");
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: name === "roles" ? [value] : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !user.first_name.trim() ||
      !user.last_name.trim() ||
      !user.username.trim() ||
      !user.id_seccion.trim() ||
      !user.cargo.trim() ||
      user.roles.length === 0 ||
      !user.password.trim() ||
      !Repass.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Todos los campos son obligatorios",
      });
      return;
    }
    setIsLoading(true);

    try {
      const result = await user_post(user);
      console.log("Respuesta de la API", result);

      // Guardar en localStorage
      localStorage.setItem("seccionId", user.unidad_admi);
      localStorage.setItem("seccionName", user.nombre_unidad);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Usuario creado con éxito",
      });

      setUser(initialUserState);
      setRepass("");
    } catch (error) {
      console.log("Error", error);

      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Algo salió mal. Por favor intente de nuevo",
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
                      Registro de Usuarios
                    </h5>
                  </div>
                  <div className="card-body">
                    <form action="" onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputName"
                              type="text"
                              placeholder="Ingresa tu usuario"
                              value={user.first_name}
                              onChange={handleInputChange}
                              name="first_name"
                            />
                            <label htmlFor="inputName">Nombre</label>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputLastName"
                              type="text"
                              placeholder="Ingresa tu Apellido"
                              value={user.last_name}
                              onChange={handleInputChange}
                              name="last_name"
                            />
                            <label htmlFor="inputLastName">Apellido</label>
                          </div>
                        </div>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="text"
                          placeholder="Ingresa tu usuario"
                          value={user.username}
                          onChange={handleInputChange}
                          name="username"
                        />
                        <label htmlFor="inputUsername">Nombre de usuario</label>
                      </div>

                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="inputEmail"
                          type="email"
                          placeholder="name@example.com"
                          value={user.email}
                          onChange={handleInputChange}
                          name="email"
                        />
                        <label htmlFor="inputEmail">Correo Electrónico</label>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <select
                              className="multisteps-form_input form-select"
                              id="UA"
                              value={user.id_seccion}
                              onChange={handleInputChange}
                              name="id_seccion"
                            >
                              <option value="">
                                Seleccione su Unidad Administrativa
                              </option>
                              {secciones.map((seccion) => (
                                <option
                                  key={seccion.id_seccion}
                                  value={seccion.id_seccion}
                                >
                                  {seccion.seccion}
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
                              value={user.cargo}
                              onChange={handleInputChange}
                              name="cargo"
                            />
                            <label htmlFor="inputCargo">Cargo</label>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col">
                          <div className="form-floating">
                            <select
                              className="multisteps-form_input form-select"
                              id="roles"
                              value={user.roles[0]}
                              onChange={handleInputChange}
                              name="roles"
                            >
                              <option value="">Seleccione su rol</option>
                              <option value={Roles.Admin}>Administrador</option>
                              <option value={Roles.JefeArea}>
                                Jefe de Area
                              </option>
                              <option value={Roles.Personal}>Personal</option>
                              <option value={Roles.Lectura}>Lectura</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputPass"
                              type="password"
                              placeholder="Contraseña"
                              value={user.password}
                              onChange={handleInputChange}
                              name="password"
                            />
                            <label htmlFor="inputPass">Contraseña</label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              id="inputRePass"
                              type="password"
                              placeholder="Confirma la contraseña"
                              value={Repass}
                              onChange={(e) => setRepass(e.target.value)}
                            />
                            <label htmlFor="inputRePass">
                              Confirma la contraseña
                            </label>
                          </div>
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
