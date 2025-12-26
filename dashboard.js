import { auth, db } from "../js/firebase.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/*  USER NAME */
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

/* PAST VISITS */
async function loadPastVisits(user) {
  const visitsList = document.querySelector("#pastVisitsList");

  if (!visitsList) {
    console.error("⚠ pastVisitsList UL not found in dashboard.html");
    return;
  }

  visitsList.innerHTML = "<li>Loading...</li>";

  try {
    const q = query(
      collection(db, "scheduleVisits"),
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

auth.onAuthStateChanged(async (user) => {
  if (user) {
    loadPastVisits(user);
  }
});

/* ECO POINTS*/
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const pointsText = document.getElementById("pointsText");
  if (!pointsText) return;

  try {
    const pointsRef = doc(db, "userPoints", user.uid);
    const snap = await getDoc(pointsRef);

  
    let points = 0;

    if (snap.exists()) {
      points = snap.data().points ?? 0;
    }

    pointsText.innerText = `${points} points`;
  } catch (error) {
    console.error("Error fetching points:", error);
    pointsText.innerText = "0 points";
  }
});

/*SCHEDULED VISITS*/
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const list = document.getElementById("appointmentsList");
  if (!list) return;

  list.innerHTML = "<p>Loading scheduled visits...</p>";

  try {
    const q = query(
      collection(db, "scheduleVisits"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = "<p class='text-gray-500'>No scheduled visits yet.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();

      const div = document.createElement("div");
      div.className = "border rounded p-3 bg-gray-50";

      div.innerHTML = `
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Date & Time:</strong> ${data.dateTime}</p>
        <p><strong>Devices:</strong> ${data.devices.join(", ")}</p>
        <p><strong>Condition:</strong> ${data.condition}</p>
      `;

      list.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading scheduled visits:", error);
    list.innerHTML = "<p class='text-red-500'>Unable to load visits.</p>";
  }
});

