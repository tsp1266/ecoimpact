import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const form = document.getElementById("authForm");

/* LOGIN */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location.href = "dashboard/dashboard.html";
    })
    .catch((err) => {
      message.innerText = err.message;
    });
});

/* SIGN UP */
document.getElementById("signupBtn").addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location.href = "profile.html";
    })

    .catch((err) => {
      message.innerText = err.message;
    });
});
