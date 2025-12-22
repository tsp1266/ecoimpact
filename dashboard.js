import { auth, db } from "../js/firebase.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  console.log("USER UID:", user.uid); // Debug

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    console.log("USER DATA:", userSnap.data());
    document.getElementById("userName").innerText =
      userSnap.data().name || "User";
  } else {
    document.getElementById("userName").innerText = "No Profile";
  }
});

import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==============================
// FETCH PAST VISITS FROM FIRESTORE
// ==============================

async function loadPastVisits(user) {
  const visitsList = document.querySelector("#pastVisitsList");

  if (!visitsList) {
    console.error("⚠ pastVisitsList UL not found in dashboard.html");
    return;
  }

  visitsList.innerHTML = "<li>Loading...</li>";

  try {
    const q = query(
      collection(db, "scheduledVisits"),
      where("uid", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    visitsList.innerHTML = "";

    if (querySnapshot.empty) {
      visitsList.innerHTML = "<li>No past visits found.</li>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const li = document.createElement("li");
      li.textContent = `${data.date} – ${data.items.join(", ")}`;
      visitsList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading visits:", err);
    visitsList.innerHTML = "<li>Error loading visits.</li>";
  }
}

// RUN AFTER USER LOGIN
auth.onAuthStateChanged(async (user) => {
  if (user) {
    loadPastVisits(user);
  }
});
