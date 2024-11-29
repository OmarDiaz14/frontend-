import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import { Expediente } from "../pages/Expediente/Expediente";
import { AgregarUsuario } from "../pages/Usuario/AgregarUsuario";
import { Usuario } from "../pages/Usuario/Perfil";
import { Seccion } from "../pages/Cuadro/Seccion";
import { Serie } from "../pages/Cuadro/Serie";
import { Subserie } from "../pages/Cuadro/Subserie";
import { Crear_Expediente } from "../pages/Expediente/Crear_Expediente";
import { Ficha } from "../pages/Ficha/Crear_Ficha";
import { Ficha_Registro } from "../pages/Ficha/Ficha_Registro";
import { ListaUsers } from "../pages/Usuario/ListaUsers";
import { Catálogo } from "../pages/Catálogo/Catálogo";
import { PortadaComponent } from "../pages/Portada/Portada";
import { Catálogo_Registro } from "../pages/Catálogo/Catálogo_Registro";
import { DatosCatalogo } from "../pages/Configuración/DatosCatalogo";
import { Portada_Registro } from "../pages/Portada/Portada_Registro";
import { Inventory } from "../pages/Inventario/inventario";
import { GuiaDocu } from "../pages/Guia_Documental/GuiaDocu";
import { hasRole } from "../services/auth.service";
import { Roles } from "../models/enums/roles_enum";
import { TableInventory } from "../pages/Inventario/TableInventario";
import { MiComponente } from "../pages/Inventario/test";
import { Subir_Documentos } from "../pages/Subir_Documentos/Subir_Documentos";
import { EditarCatalogo } from "../pages/Catálogo/EditarCatalogo";
import { EditarPortada } from "../pages/Portada/EditarPortada";
import { EditarFicha } from "../pages/Ficha/EditarFicha";
import { TableGuia } from "../pages/Guia_Documental/TableGuia";
import { TableSeccion } from "../pages/Cuadro/TableSeccion";
import { TableSerie } from "../pages/Cuadro/TableSerie";
import { TableSubserie } from "../pages/Cuadro/TableSubSerie";

export function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/Home"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Home />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="/Login" element={<Login />} />
      <Route
        path="/Expediente"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Expediente />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Agregar_Usuario"
        element={
          hasRole([Roles.Admin]) ? <AgregarUsuario /> : <Navigate to="/Home" />
        }
      />
      <Route
        path="/UserList"
        element={
          hasRole([Roles.Admin]) ? <ListaUsers /> : <Navigate to="/Home" />
        }
      />
      <Route
        path="/Usuario"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Usuario />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Seccion"
        element={hasRole([Roles.Admin]) ? <Seccion /> : <Navigate to="/Home" />}
      />
      <Route
        path="/Serie"
        element={
          hasRole([Roles.Admin, Roles.JefeArea]) ? (
            <Serie />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Subserie"
        element={
          hasRole([Roles.Admin, Roles.JefeArea]) ? (
            <Subserie />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Crear_Expediente"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Crear_Expediente />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Crear_Ficha"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Ficha />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Ficha"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Ficha_Registro />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Crear_Catálogo"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Catálogo />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Crear_Portada"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <PortadaComponent />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Catálogo"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Catálogo_Registro />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Datos_Catalogo"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <DatosCatalogo />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Portada"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Portada_Registro />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Inventario"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Inventory />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/GuiaDocu"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <GuiaDocu />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Subir_Documentos"
        element={
          hasRole([Roles.Admin, Roles.JefeArea, Roles.Personal]) ? (
            <Subir_Documentos />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />

      <Route
        path="/TableInventario"
        element={
          hasRole([Roles.Admin, Roles.JefeArea]) ? (
            <TableInventory />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />

      <Route
        path="/Test"
        element={
          hasRole([Roles.Admin, Roles.JefeArea]) ? (
            <MiComponente />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Editar_Catálogo/:id"
        element={
          hasRole([Roles.Admin, Roles.JefeArea]) ? (
            <EditarCatalogo />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Editar_Portada/:id"
        element={
          hasRole([Roles.Admin, Roles.JefeArea]) ? (
            <EditarPortada />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/Editar_Ficha/:id"
        element={
          hasRole([Roles.Admin, Roles.JefeArea]) ? (
            <EditarFicha />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/TableGuia"
        element={
          hasRole([Roles.Admin, Roles.JefeArea]) ? (
            <TableGuia />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/TableSeccion"
        element={
          hasRole([Roles.JefeArea, Roles.Personal]) ? (
            <TableSeccion />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
      <Route
        path="/TableSerie"
        element={
          hasRole([Roles.Personal]) ? <TableSerie /> : <Navigate to="/Home" />
        }
      />
      <Route
        path="/TableSubserie"
        element={
          hasRole([Roles.Personal]) ? (
            <TableSubserie />
          ) : (
            <Navigate to="/Home" />
          )
        }
      />
    </Routes>
  );
}
