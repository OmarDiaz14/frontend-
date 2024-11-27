import axios from "axios";
import api from "../api_axios";

interface portada {
  num_expediente: string;
  asunto: string;
  num_legajos: string;
  num_fojas: string;
  valores_secundarios: string;
  fecha_apertura: string;
  fecha_cierre: string;
  seccion: string;
  serie: string;
  subserie: string;
  ficha: string;
  catalogo: string;
}

export const portada_post = async (data: portada) => {
  try {
    const response = await api.post("/portada/portada/", data);

    if (response.status === 201) {
      // Asume que se devuelve un 201 Created
      console.log("portada creado exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al crear portada  " + response.statusText);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error de Axios:", error.message);
    } else {
      console.error("Error inesperado:", error);
    }
    return null;
  }
};

export const portada_get = async () => {
  try {
    const response = await api.get("/portada/portada/");

    if (response.status === 200) {
      // Asume que se devuelve la consulta
      console.log("catalogo ", response.data);
      return response.data;
    } else {
      throw new Error("no consultado" + response.statusText);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error de Axios:", error.message);
    } else {
      console.error("Error inesperado:", error);
    }
    return null;
  }
};

export const portada_put = async (id: string, data: portada) => {
  try {
    const response = await api.put(`/portada/portada/${id}/`, data);
    if (response.status === 200) {
      console.log("Portada actualizada exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al actualizar portada " + response.statusText);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error de Axios:", error.message);
    } else {
      console.error("Error inesperado:", error);
    }
    return null;
  }
};

export const portada_delete = async (id: string) => {
  try {
    const response = await api.delete(`/portada/portada/${id}/`);
    if (response.status === 204) {
      console.log("Portada eliminada exitosamente");
      return true;
    } else {
      throw new Error("Error al eliminar portada " + response.statusText);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error de Axios:", error.message);
    } else {
      console.error("Error inesperado:", error);
    }
    return false;
  }
};
