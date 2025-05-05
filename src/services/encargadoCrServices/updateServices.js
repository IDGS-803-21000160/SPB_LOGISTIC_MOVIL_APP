import axios from "axios";
import API_BASE_URL from "../../../config";

const updateRutaService = async (id_ruta, body) => {
  const url = `${API_BASE_URL}/consult/rutaUnitaria/${id_ruta}`;

  try {
    const response = await axios.put(url, body);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export { updateRutaService };
