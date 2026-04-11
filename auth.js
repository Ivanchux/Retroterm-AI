import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
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
    sesiones: 0,
    articulos: 0,
    createdAt: serverTimestamp(),
  });

  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;
  console.log("Usuario Google:", user.uid, user.email);

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    console.log("Documento existe:", snap.exists());
    if (!snap.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || user.email.split("@")[0],
        email:    user.email,
        role:     "USER",
        proyectos: 0,
        sesiones:  0,
        articulos: 0,
        createdAt: serverTimestamp(),
      });
      console.log("Documento creado ok");
    }
  } catch(e) {
    console.error("Error Firestore:", e);
  }

  return user;
}

export async function logoutUser() {
  await signOut(auth);
}