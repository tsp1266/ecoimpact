import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 Paste values from Firebase Console
const firebaseConfig = {
  apiKey: ",
  authDomain: "ecoimpact-81f2d.firebaseapp.com",
  projectId: "ecoimpact-81f2d",
  appId: "1:339517294020:web:a2c4d226710cf78c651091",
};

// 🔌 Connect website to Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Enable Authentication
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
