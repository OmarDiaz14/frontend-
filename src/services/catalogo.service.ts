import axios from "axios";
import api from "../api_axios";

interface catalogo {
  id_catalogo: string;
  catalogo: string;
  archivo_tramite: string;
  archivo_concentracion: string;
  destino_expe: string;
  type_access: string;
  valores_documentales: string;
  observaciones: string;
  id_seccion: string;
  id_serie: string;
  id_subserie: string;
}

interface destino {
  destino: string;
}

interface type {
  type: string;
}

interface valor {
  valores: string;
}

export const catalogo_post = async (data: catalogo) => {
  try {
    const response = await api.post("/catalogo/Catalogo/", data);

    if (response.status === 201) {
      // Asume que se devuelve un 201 Created
      console.log("catalogo creado exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al crear catalogo " + response.statusText);
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

export const catalogo_put = async (id: string, data: catalogo) => {
  try {
    const response = await api.put(`/catalogo/Catalogo/${id}/`, data);
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

export const catalogo_delete = async (id: string) => {
  try {
    const response = await api.delete(`/catalogo/Catalogo/${id}/`);
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

export const destino_post = async (data: destino) => {
  try {
    const response = await api.post("/catalogo/Destino/", data);

    if (response.status === 201) {
      // Asume que se devuelve un 201 Created
      console.log("destino creado exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al crear destino " + response.statusText);
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

export const type_post = async (data: type) => {
  try {
    const response = await api.post("/catalogo/Type/", data);

    if (response.status === 201) {
      // Asume que se devuelve un 201 Created
      console.log("tipo creado exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al crear el tipo " + response.statusText);
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

export const valor_post = async (data: valor) => {
  try {
    const response = await api.post("/catalogo/Valores/", data);

    if (response.status === 201) {
      // Asume que se devuelve un 201 Created
      console.log("valor creado exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al crear el valor " + response.statusText);
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

export const catalogo_get = async () => {
  try {
    const response = await api.get("/catalogo/Catalogo/");

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

export const destino_get = async () => {
  try {
    const response = await api.get("/catalogo/Destino/");

    if (response.status === 200) {
      // Asume que se devuelve la consulta
      console.log("Destino ", response.data);
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

export const type_get = async () => {
  try {
    const response = await api.get("/catalogo/Type/");

    if (response.status === 200) {
      // Asume que se devuelve la consulta
      console.log("Type ", response.data);
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

export const valor_get = async () => {
  try {
    const response = await await api.get("/catalogo/Valores/");

    if (response.status === 200) {
      // Asume que se devuelve la consulta
      console.log("Valor", response.data);
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
