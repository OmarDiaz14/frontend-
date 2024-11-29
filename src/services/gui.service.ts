import axios from "axios";
import api from "../api_axios";

interface guia {
  id_guia: string;
  descripcion: string;
  volumen: string;
  ubicacion_fisica: string;
  num_expediente: string;
  inventario: string;
  /*serie: string;
  seccion: string;*/
}

export const guia_post = async (data: guia) => {
  try {
    console.log("Sendidng data: ", data);
    console.log(
      "Full url:",
      `${import.meta.env.VITE_API_URL}/guia_docu/guia_doc`
    );
    const response = await api.post("/guia_docu/guia_doc/", data);
    return response.data;
  } catch (error: any) {
    console.error("Full error", error);
    console.error("Error response:", error.response);
    console.error("Error request:", error.request);
    throw error;
  }
};

export const guia_get = async () => {
  try {
    const response = await api.get("/guia_docu/guia_doc/");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching guia", error);
    throw error;
  }
};

export const guia_put = async (id: string, data: guia) => {
  try {
    const response = await api.put(`/guia_docu/guia_doc/${id}/`, data);
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

export const guia_delete = async (id: string) => {
  try {
    const response = await api.delete(`/guia_docu/guia_doc/${id}/`);
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
