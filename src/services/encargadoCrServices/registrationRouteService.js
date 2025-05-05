import axios from "axios";
import API_BASE_URL from "../../../config";

const postAddRoute = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/routes/agregarRuta`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting route unit:", error);
    throw error;
  }
};

const postConvertSharedRoute = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/routes/convertirRutaCompartida`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error converting shared route:", error);
    throw error;
  }
};

export { postAddRoute, postConvertSharedRoute };
