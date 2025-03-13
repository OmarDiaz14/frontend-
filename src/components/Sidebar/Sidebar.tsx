import React, { useState } from "react";
import styled from "styled-components";
import Isotipo from "../../assets/Isotipo_blanco.png";
import "../../styles/Styles.css";
import { Variables } from "../../styles/Variables";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineDown,
  AiOutlineRight,
} from "react-icons/ai";
import { TiDocumentAdd } from "react-icons/ti";
import { IoDocumentsOutline } from "react-icons/io5";
import { MdOutlineUploadFile } from "react-icons/md";
import { SiInternetarchive } from "react-icons/si";
import { LuSettings } from "react-icons/lu";
import { GiExitDoor } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { RiTableLine } from "react-icons/ri";
import { RiArchiveStackLine } from "react-icons/ri";
import { logout } from "../../services/auth.service";
import { hasRole } from "../../services/auth.service";
import { Roles } from "../../models/enums/roles_enum";
import Icono from "../../assets/right-arrow.png";
import { MdOutlineInventory } from "react-icons/md";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  subMenu?: MenuItem[];
  onClick?: string;
  requiredRoles?: Roles[];
}

interface MenuItemProps extends MenuItem {
  sidebarOpen: boolean;
  handleLogout?: () => void;
  onMenuClick?: () => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  return (
    <Container isOpen={sidebarOpen}>
      <button className="Boton_Siderbar" onClick={toggleSidebar}>
        <img src={Icono} alt="Icono" width={10} />
      </button>

      <div className="Contenedor_Iconotipo">
        <div className="Estilo_Iconotipo">
          <img src={Isotipo} alt="Iconotipo Tlaxcala" />
        </div>
      </div>

      {LinksArray.filter((item) => hasRole(item.requiredRoles || [])).map(
        (item) => (
          <MenuItemComponent
            key={item.label}
            {...item}
            sidebarOpen={sidebarOpen}
            handleLogout={handleLogout}
            onMenuClick={handleMenuClick}
          />
        )
      )}

      <Divider />

      {linksArray
        .filter((item) => hasRole(item.requiredRoles || []))
        .map((item) => (
          <MenuItemComponent
            key={item.label}
            {...item}
            sidebarOpen={sidebarOpen}
            handleLogout={handleLogout}
            onMenuClick={handleMenuClick}
          />
        ))}
    </Container>
  );
}

const LinksArray: MenuItem[] = [
  {
    label: "Crear Cuadro General",
    icon: <SiInternetarchive />,
    to: "/Seccion",
    requiredRoles: [Roles.Admin, Roles.JefeArea],
    subMenu: [
      {
        label: "Carga de Cuadro General",
        icon: <MdOutlineUploadFile />,
        to: "/cargamasiva",
        requiredRoles: [Roles.Admin],
      },
      {
        label: "Agregar Sección",
        icon: <HiOutlineDocumentDuplicate />,
        to: "/Seccion",
        requiredRoles: [Roles.Admin],
      },
      {
        label: "Agregar Serie",
        icon: <HiOutlineDocumentDuplicate />,
        to: "/Serie",
        requiredRoles: [Roles.Admin, Roles.JefeArea],
      },
      {
        label: "Agregar Subserie",
        icon: <HiOutlineDocumentDuplicate />,
        to: "/Subserie",
        requiredRoles: [Roles.Admin, Roles.JefeArea],
      },
      /*  {
        label: "Tabla Sección",
        icon: <RiTableLine />,
        to: "/TableSeccion",
        requiredRoles: [Roles.JefeArea, Roles.Personal],
      }, */
      {
        label: "Tabla Serie",
        icon: <RiTableLine />,
        to: "/TableSerie",
        requiredRoles: [Roles.Personal],
      },
      {
        label: "Tabla Subserie",
        icon: <RiTableLine />,
        to: "/TableSubserie",
        requiredRoles: [Roles.Personal],
      },
    ],
  },
  {
    label: "Crear Instrumentos Archivísticos",
    icon: <TiDocumentAdd />,
    to: "/Crear_Expediente",
    requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
  },

  {
    label: "Registros ",
    icon: <IoDocumentsOutline />,
    to: "/Instrumentos_Archivisticos",
    requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
    subMenu: [
      {
        label: "Cuadro General",
        icon: <RiTableLine />,
        to: "/CuadroGeneral",
        requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
      },

      {
        label: "Ficha Técnica",
        icon: <RiTableLine />,
        to: "/Ficha",
        requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
      },
      {
        label: "Catálogo",
        icon: <RiTableLine />,
        to: "/Catálogo",
        requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
      },
      {
        label: "Portada",
        icon: <RiTableLine />,
        to: "/Portada",
        requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
      },

      {
        label: "Guía",
        icon: <RiTableLine />,
        to: "/GuiaDocu",
        requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
      },
    ],
  },
  {
    label: "Inventario",
    icon: <MdOutlineInventory />,
    to: "/Subir_Documentos",
    requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
    subMenu: [
      {
        label: "Agregar Expediente a Inventario  ",
        icon: <RiTableLine />,
        to: "/TableInventory",
        requiredRoles: [Roles.Personal],
      },
      {
        label: "Autorización de Expediente para Inventario",
        icon: <RiTableLine />,
        to: "/InventoryAuth",
        requiredRoles: [Roles.Admin, Roles.JefeArea],
      },
      {
        label: "Inventario General",
        icon: <RiTableLine />,
        to: "/FinalInventory",
        requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
      },
    ],
  },

  {
    label: "Subir Documentación a Alfresco",
    icon: <MdOutlineUploadFile />,
    to: "/Subir_Documentos",
    requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
  },
];

const linksArray: MenuItem[] = [
  {
    label: "Herramientas de Administración  ",
    icon: <LuSettings />,
    to: "/AgregarUsuario",
    requiredRoles: [Roles.Admin],
    subMenu: [
      {
        label: "Agregar usuarios",
        icon: <AiOutlineUser />,
        to: "/Agregar_Usuario",
        requiredRoles: [Roles.Admin],
      },

      {
        label: "Datos Adicionales de Catálogo",
        icon: <RiArchiveStackLine />,
        to: "/Datos_Catalogo",
        requiredRoles: [Roles.Admin],
      },
    ],
  },
  {
    label: "Cerrar Sesión  ",
    icon: <GiExitDoor />,
    to: "/Login",
    onClick: "logout",
    requiredRoles: [Roles.Admin, Roles.JefeArea, Roles.Personal],
  },
];

const MenuItemComponent: React.FC<MenuItemProps> = ({
  label,
  icon,
  to,
  subMenu,
  sidebarOpen,
  onClick,
  handleLogout,
  onMenuClick,
  requiredRoles,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    onMenuClick?.();
    if (subMenu) {
      setIsOpen(!isOpen);
    }
  };

  if (subMenu) {
    return (
      <div className="Contenedor_Links">
        <div
          onClick={handleClick}
          className="Links"
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="Iconos_Links">{icon}</div>
            {sidebarOpen && <span>{label}</span>}
          </div>
          {sidebarOpen && (
            <div className="Dropdown_Indicator">
              {isOpen ? <AiOutlineDown /> : <AiOutlineRight />}
            </div>
          )}
        </div>
        {isOpen && sidebarOpen && (
          <ul className="Submenu">
            {subMenu
              .filter((item) => hasRole(item.requiredRoles || []))
              .map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className="Links SubmenuItem"
                    onClick={onMenuClick}
                  >
                    <div className="Iconos_Links">{item.icon}</div>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  }

  if (onClick === "logout") {
    return (
      <div className="Contenedor_Links">
        <div
          onClick={() => {
            onMenuClick?.();
            handleLogout?.();
          }}
          className="Links"
          style={{ cursor: "pointer" }}
        >
          <div className="Iconos_Links">{icon}</div>
          {sidebarOpen && <span>{label}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="Contenedor_Links">
      <NavLink
        to={to}
        onClick={onMenuClick}
        className={({ isActive }) => `Links${isActive ? " active" : ""}`}
      >
        <div className="Iconos_Links">{icon}</div>
        {sidebarOpen && <span>{label}</span>}
      </NavLink>
    </div>
  );
};

const Container = styled.div<{ isOpen: boolean }>`
  position: sticky;
  top: 0;
  height: 150vh;
  color: #fff;
  background: #171717;

  /* Contenedor con posición relativa para el botón */
  position: relative; /* Añadido para que el botón se posicione relativo al sidebar */

  /* Botón de sidebar */
  .Boton_Siderbar {
    position: absolute; /* Volvemos a absolute para que se posicione relativo al sidebar */
    top: 100px;

    right: ${({ isOpen }) => (isOpen ? "-18px" : "-25px")};
    height: 32px;
    background: gray;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: ${({ isOpen }) => (isOpen ? "rotate(0deg)" : "rotate(180deg)")};
    border: none;
    z-index: 1000;
    border-radius: 30px;
  }

  .Contenedor_Iconotipo {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: ${Variables.lgSpacing};
    padding-top: 40px;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ isOpen }) => (isOpen ? `scale(1.9)` : `scale(1.0)`)};
    height: auto;
    margin-bottom: 40px;

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
  }

  .Estilo_Iconotipo img {
    width: 50px;
    height: auto;
    object-fit: contain;
  }

  .Contenedor_Links {
    margin: 10px 0;
    height: auto;
    padding: 0 14%;

    :hover {
      background: #2a2a2a;
    }

    .Links {
      display: flex;
      align-items: center;
      height: auto;
      text-decoration: none;
      padding: calc(${Variables.smSpacing} - 2px) 0;
      color: #eaeaea;

      .Iconos_Links {
        padding: ${Variables.smSpacing} ${Variables.mdSpacing};
        display: flex;

        svg {
          font-size: 25px;
        }
      }

      &.active {
        .Iconos_Links {
          svg {
            color: #2a2a2a;
          }
        }
      }
    }
  }

  .Submenu {
    list-style-type: none;
    padding-left: ${Variables.mdSpacing};
  }

  .SubmenuItem {
    padding: ${Variables.smSpacing} 0;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: #fff;
  margin: ${Variables.lgSpacing} 0;
`;

export default Sidebar;
