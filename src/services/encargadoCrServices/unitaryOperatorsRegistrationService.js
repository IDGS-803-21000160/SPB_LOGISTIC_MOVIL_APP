import axios from "axios";
import API_BASE_URL from "../../../config";

const postAddUnitaryOperators = async (data) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/routes/insertRouteUnit`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting route unit:", error);
    throw error;
  }
};

export { postAddUnitaryOperators };
