import "../../styles/Styles.css";

import Usuarios from "../../assets/Usuario 1.png";
import { Boton } from "../../components/Botones/Botones";
import "../../../node_modules/remixicon/fonts/remixicon.css";
import { getUser } from "../../services/auth.service";

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
  const user = getUser();
  const ButtonClick = () => {
    window.location.href = "/Home";
  };

  return (
    //Contenedor principal
    <div className="container">
      {/* Header */}

      {/*Main-Profile card*/}
      <section className="userProfile card">
        <div className="profile">
          <figure>
            <img src={Usuarios} alt="Perfil" width={250} height={250} />
          </figure>
        </div>
      </section>

      {/*Work & Skills Section*/}
      <section className="work_skills card">
        {/*Work container*/}
        <div className="work">
          <h1 className="heading">Informacion General</h1>
          <div className="Primary">
            <h1>UNIDAD ADMINISTRATIVA</h1>
            <p>{user.unidad_admi}</p>
          </div>

          <div className="secondary">
            <h1>CARGO</h1>
            <p>{user.cargo}</p>
          </div>

          <div className="secondary">
            <h1>ROL</h1>
            <p>{getRoleName(user.roles[0])}</p>
          </div>
        </div>
      </section>

      {/*Detalles del usuario*/}
      <section className="userDetails card">
        <div className="userName">
          <h1 className="name">
            {user.first_name} {user.last_name}
          </h1>
          <p>{user.unidad_admi}</p>
        </div>

        <div className="rank">
          <h1 className="heading">Nombre de Usuario</h1>
          <h1>@{user.username}</h1>
        </div>
      </section>

      <section className="timeline_about card">
        <div className="tabs">
          <ul>
            <li>
              <span>ACERCA DE</span>
            </li>
          </ul>
        </div>

        <div className="contact_info">
          <ul>
            <li className="nombre_usuario">
              <h1 className="label">NOMBRE COMPLETO:</h1>
              <span className="info">
                {user.first_name} {user.last_name}
              </span>
            </li>

            <li className="email">
              <h1 className="label">CORREO ELECTRÓNICO:</h1>
              <span className="info">{user.email}</span>
            </li>
          </ul>
        </div>
        <div>
          <Boton onClick={ButtonClick}>Regresar</Boton>
        </div>
      </section>
    </div>
  );
}
