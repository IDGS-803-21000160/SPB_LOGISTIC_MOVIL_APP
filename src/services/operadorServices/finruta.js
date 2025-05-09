import axios from "axios";
import API_BASE_URL from "../../../config";

export const postCierreRuta = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/finRuta/insertCierreRuta`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error al insertar inicio de ruta:", error);
    throw error;
  }
};
