// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// ¡Aquí pones la configuración que copiaste de la consola de Firebase!
const firebaseConfig = {
  apiKey: "AIzaS...", // Tu clave API real
  authDomain: "cuidador-web.firebaseapp.com", // El dominio de tu proyecto
  projectId: "cuidador-web", // Tu ID de proyecto real
  storageBucket: "cuidador-web.appspot.com", // Tu bucket de Storage real
  messagingSenderId: "1080620442040", // Tu ID de remitente real
  appId: "1:1080620442040:web:...", // Tu ID de app real
  // También podrías tener measurementId si usas Analytics
};

// Inicializa Firebase con tu configuración
const app = initializeApp(firebaseConfig);

// Obtiene una referencia al servicio de Storage
export const storage = getStorage(app);
