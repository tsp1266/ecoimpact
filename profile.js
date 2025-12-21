import { auth, db } from "./js/firebase.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btn = document.getElementById("saveProfile");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("User not logged in");
    window.location.href = "login.html";
    return;
  }

  btn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const city = document.getElementById("city").value.trim();

    if (!name || !age || !city) {
      alert("Please fill all fields");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        age,
        city,
        createdAt: new Date(),
      });

      alert("Profile created successfully!");
      window.location.href = "dashboard/dashboard.html";
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Error creating profile: " + error.message);
    }
  });
});
