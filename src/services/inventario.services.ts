import axios from "axios";
import api from "../api_axios";

interface inventario {
  serie: string;
  descripsion: string;
  observaciones: string;
  estatus: string;
  expediente: string;
}

export const invetario_post = async (data: inventario) => {
  try {
    console.log("Sending data:", data);
    console.log(
      "Full URL:",
      `${import.meta.env.VITE_API_URL}/inventario/inventario/`
    );
    const response = await api.post("/inventario/inventario/", data);
    return response.data;
  } catch (error: any) {
    console.error("Full error:", error);
    console.error("Error response:", error.response);
    console.error("Error request:", error.request);
    throw error;
  }
};

export const inventario_get = async () => {
  try {
    const response = await api.get("/inventario/inventario/");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching inventario:", error);
    throw error;
  }
};

export const inventario_put = async (id: string, data: inventario) => {
  try {
    const response = await api.put(`/inventario/inventario/${id}/`, data);
    if (response.status === 200) {
      console.log("Catalogo actualizado exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al actualizar catalogo " + response.statusText);
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

export const inventario_delete = async (id: string) => {
  try {
    const response = await api.delete(`/inventario/inventario/${id}/`);
    if (response.status === 204) {
      console.log("Catalogo eliminado exitosamente");
      return true;
    } else {
      throw new Error("Error al eliminar catalogo " + response.statusText);
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
