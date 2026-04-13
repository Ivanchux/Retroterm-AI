import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBfGaWjmQQUJz4PCuog2bGqvNH4HNfAdjM",
  authDomain:        "retroterm-ai-f7a31.firebaseapp.com",
  projectId:         "retroterm-ai-f7a31",
  storageBucket:     "retroterm-ai-f7a31.firebasestorage.app",
  messagingSenderId: "445990335441",
  appId:             "1:445990335441:web:91342f77a1cfe108e0e6f0",
  measurementId:     "G-WC9WDE9N8C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
