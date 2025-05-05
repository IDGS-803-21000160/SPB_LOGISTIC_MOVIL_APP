import axios from "axios";
import API_BASE_URL from "../../../config"

export const insertInicioRuta = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/inicioRuta/insertInicioRuta`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al insertar inicio de ruta:", error);
      throw error;
    }
  };
