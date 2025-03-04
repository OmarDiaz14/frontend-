import axios from "axios";
import api from "../api_axios";

interface portadaCards {
  totalPortadas: number;
  seccionId: number; // Añadir seccionId
}

interface fichaCards {
  totalFichas: number;
  seccionId: number; // Añadir seccionId
}

interface catalogoCards {
  totalCatalogos: number;
  seccionId: number; // Añadir seccionId
}

export const portadaCardsget = async (data: portadaCards) => {
  try {
    const response = await api.get(
      `https://backend-lga.onrender.com/dashboard/dashboard/${data.seccionId}/get-total-portadas/`
    );

    if (response.status === 201) {
      console.log("Data cargada exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al cargar la informacion: " + response.statusText);
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

export const fichaCardsget = async (data: fichaCards) => {
  try {
    const response = await api.get(
      `https://backend-lga.onrender.com/dashboard/${data.seccionId}/get-total-fichas/`
    );

    if (response.status === 201) {
      console.log("Data cargada exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al cargar la informacion: " + response.statusText);
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

export const catalogoCardsget = async (data: catalogoCards) => {
  try {
    const response = await api.get(
      `https://backend-lga.onrender.com/dashboard/dashboard/${data.seccionId}/get-total-catalogos/`
    );

    if (response.status === 201) {
      console.log("Data cargada exitosamente:", response.data);
      return response.data;
    } else {
      throw new Error("Error al cargar la informacion: " + response.statusText);
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
