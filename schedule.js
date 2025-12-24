// ----------------------
// Nearest E-Waste Centre Search Feature (FIXED)
// ----------------------

import { db, auth } from "../js/firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const centerResults = document.getElementById("centerResults");

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim().toLowerCase();
  centerResults.innerHTML = "";

  if (!city) {
    centerResults.innerHTML =
      "<p class='text-red-500'>Please enter a city.</p>";
    return;
  }

  try {
    const centersRef = collection(db, "ewaste_centers");
    const q = query(centersRef, where("city", "==", city));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      centerResults.innerHTML = `<p class='text-gray-700'>No centres found for ${city}.</p>`;
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();

      const card = document.createElement("div");
      card.className =
        "border p-2 mb-2 rounded shadow cursor-pointer hover:bg-green-50";

      card.innerHTML = `
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Contact:</strong> ${data.contact}</p>
      `;

      card.addEventListener("click", () => {
        document.getElementById("location").value = data.address;
        centerResults.innerHTML = `<p class='text-green-600'>Selected Centre: ${data.address}</p>`;
      });

      centerResults.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching centres:", error);
    centerResults.innerHTML =
      "<p class='text-red-500'>Error fetching centres. Try again.</p>";
  }
});

// ----------------------
// YOUR ORIGINAL CODE (UNCHANGED)
// ----------------------

const form = document.getElementById("scheduleForm");
const message = document.getElementById("message");

// Ensure user is logged in
auth.onAuthStateChanged((user) => {
  if (!user) {
    alert("You must be logged in to schedule a visit!");
    window.location.href = "../index.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    message.style.color = "red";
    message.innerText = "You must be logged in!";
    return;
  }

  const location = document.getElementById("location").value.trim();
  const dateTime = document.getElementById("dateTime").value;

  const devices = Array.from(
    document.querySelectorAll('input[name="device"]:checked')
  ).map((d) => d.value);

  const brands = Array.from(
    document.querySelectorAll('input[name="brand"]:checked')
  ).map((b) => b.value);

  const condition = document.querySelector(
    'input[name="condition"]:checked'
  )?.value;

  if (
    !location ||
    !dateTime ||
    !devices.length ||
    !brands.length ||
    !condition
  ) {
    message.style.color = "red";
    message.innerText = "Please fill all fields!";
    return;
  }

  try {
    await addDoc(collection(db, "scheduleVisits"), {
      userId: user.uid,
      location,
      dateTime,
      devices,
      brands,
      condition,
      timestamp: serverTimestamp(),
    });

    message.style.color = "green";
    message.innerText = "Visit scheduled successfully!";
    form.reset();
  } catch (error) {
    console.error("Error saving schedule:", error);
    message.style.color = "red";
    message.innerText = "Error: " + error.message;
  }
});
