/**
 * nav-auth.js — RETROTERM.AI
 * ─────────────────────────────────────────────────────────────
 * Módulo reutilizable que gestiona el botón de acceso (login/perfil)
 * en todas las páginas. Importar con:
 *
 *   <script type="module" src="nav-auth.js"></script>
 *
 * Requisitos del HTML:
 *   - Un elemento con id="btn-acceso"
 *   - (Opcional) Un elemento con id="nav-username" para mostrar el nombre
 *
 * Comportamiento:
 *   - El botón empieza INVISIBLE hasta que Firebase resuelve el estado
 *     (evita el flash de "LOGIN" cuando en realidad hay sesión activa)
 *   - Con sesión  → texto "[ MI PERFIL ]" / "[ username ]", href → perfil.html
 *   - Sin sesión  → texto "[ LOGIN ]", href → login.html
 *   - Al hacer clic sin sesión no navega directamente a perfil.html
 *     (la URL del href nunca apunta a perfil.html si no hay auth)
 * ─────────────────────────────────────────────────────────────
 */

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc }        from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db }           from './firebase-config.js';

// ── Estilos base que aplica el módulo sobre btn-acceso ──────────
const BASE_STYLE = `
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-decoration: none;
  border: 1px solid;
  padding: 6px 12px;
  transition: color 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s;
  cursor: pointer;
  opacity: 0;                       /* invisible hasta resolver auth */
  transition: opacity 0.25s;
`;

// ── Variante: sesión activa ──────────────────────────────────────
function applyLoggedIn(btn, label) {
  btn.textContent    = label;
  btn.href           = 'perfil.html';
  btn.style.color    = '#00ff66';
  btn.style.borderColor = '#003300';
  btn.removeAttribute('data-auth-guard'); // limpia guard por si acaso
  btn.onmouseenter = () => {
    btn.style.borderColor = '#00ff66';
    btn.style.boxShadow   = '0 0 8px #00ff6622';
  };
  btn.onmouseleave = () => {
    btn.style.borderColor = '#003300';
    btn.style.boxShadow   = 'none';
  };
}

// ── Variante: sin sesión ─────────────────────────────────────────
function applyLoggedOut(btn) {
  btn.textContent    = '[ LOGIN ]';
  btn.href           = 'login.html';
  btn.style.color    = '#336633';
  btn.style.borderColor = '#002200';
  btn.dataset.authGuard = '1'; // marca para interceptar si alguien pone perfil.html a mano
  btn.onmouseenter = () => {
    btn.style.borderColor = '#336633';
    btn.style.color       = '#66ffb3';
  };
  btn.onmouseleave = () => {
    btn.style.borderColor = '#002200';
    btn.style.color       = '#336633';
  };
}

// ── Revelar el botón ─────────────────────────────────────────────
function reveal(btn) {
  // Pequeño delay para que el navegador ya haya pintado el estado correcto
  requestAnimationFrame(() => { btn.style.opacity = '1'; });
}

// ── Inicializar ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-acceso');
  if (!btn) return; // La página no tiene este botón, no hacer nada

  // Aplicar estilos base en JS para no depender de CSS externo
  // Solo si no tiene ya estilos inline relevantes
  if (!btn.style.cssText) btn.style.cssText = BASE_STYLE;
  else btn.style.opacity = '0'; // asegurar invisibilidad inicial

  // Escuchar estado de auth de Firebase
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Intentar obtener el username de Firestore para personalizar el botón
      let label = '[ MI PERFIL ]';
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists() && snap.data().username) {
          const name = snap.data().username.slice(0, 12).toUpperCase();
          label = `[ ${name} ]`;
        }
      } catch (_) {
        // Sin acceso a Firestore, usar label genérico — no es crítico
      }

      applyLoggedIn(btn, label);

      // Si hay un elemento de nombre en el nav, rellenarlo también
      const nameEl = document.getElementById('nav-username');
      if (nameEl && user.displayName) nameEl.textContent = user.displayName;

    } else {
      applyLoggedOut(btn);
    }

    reveal(btn);
  });

  // Guardia extra: interceptar clic cuando no hay sesión
  // (por si el href se puso a perfil.html desde el HTML estático)
  btn.addEventListener('click', (e) => {
    if (btn.dataset.authGuard === '1') {
      e.preventDefault();
      window.location.href = 'login.html';
    }
  });
});
