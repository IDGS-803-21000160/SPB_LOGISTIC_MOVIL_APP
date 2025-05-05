import axios from "axios";
import API_BASE_URL from "../../../config";

const getSummaryByDateAndUser = async (date, user) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/consult/rutes/${date}/${user}`
    );
    return response.data;
  } catch (error) {
    console.log("Error getting summary by date and user:", error);
    throw error;
  }
};

const getSummaryById = async (id_ruta, fecha) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/consult/${id_ruta}/${fecha}`
    );
    return response.data;
  } catch (error) {
    console.log("Error getting summary by id:", error);
    throw error;
  }
};

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

const cambiarEstadoRutaService = async (idRuta, nuevoEstado) => {
  const url = `${API_BASE_URL}/routes/cambiarEstadoRuta`;

  try {
    const response = await axios.put(url, { idRuta, nuevoEstado });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error changing route status:", error);
    throw error;
  }
};

const updateRutaOperadorService = async (idRutaOperador, idOperador) => {
  const url = `${API_BASE_URL}/consult/updateRutaOperador`;

  try {
    const response = await axios.put(url, { idRutaOperador, idOperador });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating route operator:", error);
    throw error;
  }
};

export {
  getSummaryByDateAndUser,
  getSummaryById,
  updateRutaService,
  cambiarEstadoRutaService,
  updateRutaOperadorService,
};
