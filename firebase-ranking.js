import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJIJ6I9o6eir95mrt6vyLeG07x5vEUdHqE",
  authDomain: "matecarreras-33136.firebaseapp.com",
  projectId: "matecarreras-33136",
  storageBucket: "matecarreras-33136.firebasestorage.app",
  messagingSenderId: "333646195286",
  appId: "1:333646195286:web:70f43bb01cb07ed43629f7",
  measurementId: "G-PHYQ9TZ4E9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Guardar puntaje
export async function guardarPuntaje(nombre, puntaje) {
  try {
    await addDoc(collection(db, "ranking"), {
      nombre: nombre,
      puntaje: puntaje,
      fecha: new Date()
    });
    console.log("✅ Puntaje guardado");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Obtener ranking
export async function obtenerRanking() {
  const q = query(
    collection(db, "ranking"),
    orderBy("puntaje", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);
  const datos = [];

  snapshot.forEach(doc => {
    datos.push(doc.data());
  });

  return datos;
}