import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, setDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// Configuración de Firebase
import{firebaseConfig} from "./credenciales.js"

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db =getFirestore(app);
export { db, collection, query, where, getDocs, setDoc, doc, addDoc };