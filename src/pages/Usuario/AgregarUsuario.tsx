import "../../styles/Styles.css";
import Logo from "../../assets/Tlaxcala.png";
import { Boton } from "../../components/Botones/Botones";
import React, { useEffect, useState } from "react";
import { user_post } from "../../services/user.services";
import { User } from "../../services/var.user.services";
import Swal from "sweetalert2";
import { seccion } from "../../Producto";
import { Seccion_get } from "../../services/cuadro.service";
import { Roles } from "../../models/enums/roles_enum";

export function AgregarUsuario() {
  const initialUserState = new User();
  const [user, setUser] = useState<User>(initialUserState);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
      [name]: name === "roles" ? [value] : value,
    }));
  };

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !user.first_name.trim() ||
      !user.last_name.trim() ||
      !user.username.trim() ||
      !user.unidad_admi.trim() ||
      !user.cargo.trim() ||
      user.roles.length === 0 ||
      user.roles[0].trim() === "" ||
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

      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: "Usuario creado con exito",
      });

      setUser(initialUserState);
      setRepass("");
    } catch (error) {
      console.log("Error", error);

      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Algo salio mal. Por favor intente de nuevo",
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
                        Registro de Usuarios
                      </h3>
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
                            id="inputLastName"
                            type="text"
                            placeholder="Ingresa tu usuario"
                            value={user.username}
                            onChange={handleInputChange}
                            name="username"
                          />
                          <label htmlFor="inputLastName">
                            Nombre de usuario
                          </label>
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
                                value={user.unidad_admi}
                                onChange={handleInputChange}
                                name="unidad_admi"
                              >
                                <option value="">
                                  Seleccione su Unidad Administrativa
                                </option>
                                {secciones.map((seccion) => (
                                  <option value={seccion.id_seccion}>
                                    {seccion.id_seccion}
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
                              <label htmlFor="input Cargo">Cargo</label>
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
                                <option>Seleccione su rol</option>
                                <option value={Roles.Admin}>
                                  Administrador
                                </option>
                                <option value={Roles.JefeArea}>
                                  Jefe de Area
                                </option>
                                <option value={Roles.Personal}>
                                  Personal</option>
                                <option value={Roles.Lectura}>
                                  Lectura</option>
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
            </div>
          </main>
        </div>
      </div>
    </body>
  );
}
