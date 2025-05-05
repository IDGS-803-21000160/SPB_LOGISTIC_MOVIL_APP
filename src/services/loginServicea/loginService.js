import axios from "axios";
import API_BASE_URL from "../../../config";

const getUsers = async () => {
  try {
    const response = await axios.get(
      "https://65d60ba3f6967ba8e3bd5cc9.mockapi.io/usuarios"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const authService = async (usuario, contrasena) => {
  console.log("usuario", usuario);
  console.log("contrasena", contrasena);

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      usuario,
      contrasena,
    });
    return response.data;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
};

export { getUsers, authService };
