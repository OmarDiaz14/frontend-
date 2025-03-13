import "../../styles/Styles.css";
import Usuarios from "../../assets/Usuario 1.png";
import { Boton } from "../../components/Botones/Botones";
import "../../../node_modules/remixicon/fonts/remixicon.css";
import { user_profile } from "../../services/user.services";
import { useEffect, useState } from "react";
import { User } from "../../services/var.user.services";

export enum Roles {
  Admin = 1,
  JefeArea = 2,
  Personal = 3,
}

export function getRoleName(roleId: number): string {
  switch (roleId) {
    case Roles.Admin:
      return "Admin";
    case Roles.JefeArea:
      return "Jefe de Área";
    case Roles.Personal:
      return "Personal";
    default:
      return "Unknown";
  }
}

export function Usuario() {
  const [user, setUser] = useState(new User());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const items = await user_profile();
        setUser(items);
      } catch (error) {
        console.error("Error al obtener las secciones:", error);
      }
    };
    fetchUser();
  }, []);

  const ButtonClick = () => {
    window.location.href = "/Home";
  };

  return (
    <div className="container pt-10">
      <section className="userProfile card bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-lg overflow-hidden">
        <div className="profile">
          <figure className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-20 rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 blur-2xl"></div>
            <img
              src={Usuarios}
              alt="Perfil"
              className="relative z-10 w-[250px] h-[250px] object-cover rounded-full border-4 border-white shadow-md"
            />
          </figure>
        </div>
      </section>

      <section className="work_skills card bg-white shadow-md rounded-lg">
        <div className="work">
          <h1 className="heading text-xl font-semibold text-gray-800 mb-4">
            Informacion General
          </h1>

          <div className="secondary">
            <h1 className="text-sm font-medium text-gray-600 mb-1">CARGO</h1>
            <p className="text-gray-900">{user.cargo}</p>
          </div>

          <div className="secondary mt-3">
            <h1 className="text-sm font-medium text-gray-600 mb-1">ROL</h1>
            <p className="text-gray-900">{getRoleName(user.roles[0])}</p>
          </div>
        </div>
      </section>

      <section className="userDetails card bg-white shadow-md rounded-lg">
        <div className="userName">
          <h1 className="name text-2xl font-bold text-gray-800">
            {user.first_name} {user.last_name}
          </h1>
          <p className="text-gray-600">{user.name_seccion}</p>
        </div>

        <div className="rank mt-3">
          <h1 className="heading text-sm font-medium text-gray-600">
            Nombre de Usuario
          </h1>
          <h1 className="text-gray-900">@{user.username}</h1>
        </div>
      </section>

      <section className="timeline_about card bg-white shadow-md rounded-lg">
        <div className="tabs">
          <ul>
            <li>
              <span className="text-lg font-semibold text-gray-800">
                ACERCA DE
              </span>
            </li>
          </ul>
        </div>

        <div className="contact_info">
          <ul>
            <li className="nombre_usuario">
              <h1 className="label text-sm font-medium text-gray-600">
                NOMBRE COMPLETO:
              </h1>
              <span className="info text-gray-900">
                {user.first_name} {user.last_name}
              </span>
            </li>

            <li className="email mt-3">
              <h1 className="label text-sm font-medium text-gray-600">
                CORREO ELECTRÓNICO:
              </h1>
              <span className="info text-gray-900">{user.email}</span>
            </li>
          </ul>
        </div>
        <div className="mt-4">
          <Boton
            onClick={ButtonClick}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors"
          >
            Regresar
          </Boton>
        </div>
      </section>
    </div>
  );
}
