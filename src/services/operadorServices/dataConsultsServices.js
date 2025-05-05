import axios from "axios";
import API_BASE_URL from "../../../config";

export const getRouteOperador = async (id, fecha) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/consult/operador/${id}/${fecha}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching operador data:", error);
    throw error;
  }
};

export const getInfoOperador = async (id_operador) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/consult/cr/${id_operador}`
    );
    return response.data;
  } catch (error) {
    console.log("Error getting summary by id:", error);
    throw error;
  }
};

export const getInfoOperadorandCR = async (id, fecha) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/consult/routes/${id}/${fecha}`
    );
    return response.data;
  } catch (error) {
    console.log("Error getting summary by id:", error);
    throw error;
  }
};
