import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración de Firebase
import{firebaseConfig} from "./credenciales.js"

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db =getFirestore(app);
