import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

export function requireAuth() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          window.location.href = "/Retroterm-AI/login.html";
          reject(new Error("No authenticated user."));
        }
      },
      reject
    );
  });
}
