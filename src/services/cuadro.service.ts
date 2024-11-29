import axios from "axios";
import api from "../api_axios";

interface Seccion {
  id_seccion: string;
  codigo: string;
  descripcion: string;
}

interface Serie {
  serie: string;
  codigo_serie: string;
  descripcion: string;
  id_seccion: string;
}

interface SubSerie {
  SubSerie: string;
  descripcion: string;
  serie: string;
}

export const seccion_post = async (data: Seccion) => {
  try {
    const response = await api.post("/cuadro/seccion/", data);

    if (response.status === 201) {
      // Asume que se devuelve un 201 Created
      console.log("Serie creada exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al crear la serie: " + response.statusText);
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

export const serie_post = async (data: Serie) => {
  try {
    const response = await api.post("/cuadro/serie/", data);

    if (response.status === 201) {
      // Asume que se devuelve un 201 Created
      console.log("Serie creada exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al crear la serie: " + response.statusText);
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

export const subserie_post = async (data: SubSerie) => {
  try {
    const response = await api.post("/cuadro/subserie/", data);

    if (response.status === 201) {
      // Asume que se devuelve un 201 Created
      console.log("SubSerie creada exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al crear la Subserie: " + response.statusText);
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

export const Seccion_get = async () => {
  try {
    const response = await api.get("/cuadro/seccion/");

    if (response.status === 200) {
      // Asume que se devuelve la consulta
      console.log("secciones", response.data);
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

export const serie_get = async () => {
  try {
    const response = await api.get("/cuadro/serie/");

    if (response.status === 200) {
      // Asume que se devuelve la consulta
      console.log("serie", response.data);
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

export const subserie_get = async () => {
  try {
    const response = await api.get("/cuadro/subserie/");

    if (response.status === 200) {
      // Asume que se devuelve la consulta
      console.log("subserie ", response.data);
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
