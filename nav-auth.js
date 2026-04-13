/**
 * nav-auth.js — RETROTERM.AI
 * Gestiona el botón id="btn-acceso" en todas las páginas.
 * - Sin sesión  → [ LOGIN ]  → login.html
 * - Con sesión  → [ USERNAME ] → perfil.html
 * El botón arranca invisible (opacity:0 en el HTML) y se revela
 * solo cuando Firebase confirma el estado de auth.
 */

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc }        from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db }           from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-acceso');
  if (!btn) return;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Con sesión: intentar obtener username de Firestore
      let label = '[ MI PERFIL ]';
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists() && snap.data().username) {
          label = '[ ' + snap.data().username.slice(0, 12).toUpperCase() + ' ]';
        }
      } catch (_) {}

      btn.textContent   = label;
      btn.href          = 'perfil.html';
      btn.style.color   = '#00ff66';
      btn.style.borderColor = '#003300';
      btn.removeAttribute('data-auth-guard');

      btn.onmouseenter = () => { btn.style.borderColor = '#00ff66'; btn.style.boxShadow = '0 0 8px #00ff6622'; };
      btn.onmouseleave = () => { btn.style.borderColor = '#003300'; btn.style.boxShadow = 'none'; };

    } else {
      // Sin sesión
      btn.textContent   = '[ LOGIN ]';
      btn.href          = 'login.html';
      btn.style.color   = '#336633';
      btn.style.borderColor = '#002200';
      btn.dataset.authGuard = '1';

      btn.onmouseenter = () => { btn.style.borderColor = '#336633'; btn.style.color = '#66ffb3'; };
      btn.onmouseleave = () => { btn.style.borderColor = '#002200'; btn.style.color = '#336633'; };
    }

    // Revelar el botón ahora que sabemos el estado
    btn.style.opacity = '1';
  });

  // Guardia de clic: si alguien intenta llegar a perfil sin sesión
  btn.addEventListener('click', (e) => {
    if (btn.dataset.authGuard === '1') {
      e.preventDefault();
      window.location.href = 'login.html';
    }
  });
});
