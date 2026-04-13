import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
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

const googleProvider = new GoogleAuthProvider();

// Llamar esto al cargar la página para procesar el resultado del redirect
export async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;
      console.log("Redirect result recibido:", user.uid);
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          username:  user.displayName || user.email.split("@")[0],
          email:     user.email,
          role:      "USER",
          proyectos: 0,
          sesiones:  0,
          articulos: 0,
          createdAt: serverTimestamp(),
        });
        console.log("Documento creado ok");
      }
      return user;
    }
  } catch (e) {
    console.error("Error en handleGoogleRedirect:", e);
  }
  return null;
}

export async function registerUser(email, password, username) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;

  await setDoc(doc(db, "users", uid), {
    username,
    email,
    role:      "USER",
    proyectos: 0,
    sesiones:  0,
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
  // Redirige a Google — la página se recarga, el resultado se recoge en handleGoogleRedirect
  await signInWithRedirect(auth, googleProvider);
}

export async function logoutUser() {
  await signOut(auth);
}
