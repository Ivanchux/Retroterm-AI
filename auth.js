import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

export async function registerUser(email, password, username) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  await setDoc(doc(db, "users", uid), {
    username,
    email,
    role: "USER",
    proyectos: 0,
    createdAt: serverTimestamp(),
  });

  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}
