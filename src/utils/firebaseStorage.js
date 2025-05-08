import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase"; // Asegúrate que esta ruta es correcta

export const uploadFileAsync = async (uri, storagePath, mimeType) => {
  try {
    // Convertir el URI del archivo a un Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, storagePath);

    // Subir el Blob
    await uploadBytes(storageRef, blob, { contentType: mimeType });

    // Obtener la URL de descarga
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error al subir archivo:", error);
    // Es útil loguear el error específico de Firebase si está disponible
    if (error.code) {
      console.error("Firebase Storage Error Code:", error.code);
      console.error("Firebase Storage Error Message:", error.message);
    }
    throw error;
  }
};
