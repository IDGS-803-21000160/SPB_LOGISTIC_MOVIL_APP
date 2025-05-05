// src/utils/firebaseStorage.js
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

export const uploadImageAsync = async (uri, storagePath) => {
  // 1) convertir URI a blob
  const resp = await fetch(uri);
  const blob = await resp.blob();

  // 2) referencia en Storage
  const storageRef = ref(storage, storagePath);

  // 3) subir y esperar progreso
  await uploadBytesResumable(storageRef, blob);

  // 4) obtener URL pública
  return await getDownloadURL(storageRef);
};
