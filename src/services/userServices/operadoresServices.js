import axios from "axios";
import API_BASE_URL from "../../../config";

const getOperadores = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/operador`);
    return response.data;
  } catch (error) {
    console.error("Error fetching operadores:", error);
    throw error;
  }
};

const getRutasCompartidas = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/rutasCompartidas/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching rutas compartidas:", error);
    throw error;
  }
};

export { getOperadores, getRutasCompartidas };
