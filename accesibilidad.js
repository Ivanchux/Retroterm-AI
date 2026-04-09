/**
 * ============================================================
 * ACCESIBILIDAD — RETROTERM.AI
 * Mejoras de accesibilidad sin modificar HTML estructural
 * ============================================================
 * 
 * Este script añade:
 * - Skip navigation link
 * - Botón de cambio de tema (claro/oscuro)
 * - Navegación por teclado para tarjetas
 * - Roles ARIA dinámicos
 * - Soporte para prefers-reduced-motion
 * - Persistencia del tema elegido
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // 1. SKIP NAVIGATION LINK
  // ═══════════════════════════════════════════════════════════
  function crearSkipLink() {
    var skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.setAttribute('aria-label', 'Saltar al contenido principal');
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Crear un ancla invisible al inicio del contenido principal
    var mainContent = document.querySelector('.pantalla, .aria-root, section.pantalla');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    } else if (mainContent) {
      // Si ya tiene id, crear un ancla antes
      var anchor = document.createElement('div');
      anchor.id = 'main-content';
      anchor.setAttribute('tabindex', '-1');
      anchor.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;overflow:hidden;';
      document.body.insertBefore(anchor, document.body.firstChild);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 2. ENLACE DE PERFIL — Esquina superior derecha
  // ═══════════════════════════════════════════════════════════
  function crearPerfilBtn() {
    var btn = document.createElement('a');
    btn.href = 'perfil.html';
    btn.className = 'perfil-nav-btn';
    btn.setAttribute('aria-label', 'Ir al perfil de usuario');
    btn.setAttribute('title', 'Perfil de usuario');
    btn.id = 'perfil-toggle';

    // Resaltar si estamos en perfil.html
    var paginaActual = window.location.pathname.split('/').pop();
    if (paginaActual === 'perfil.html') {
      btn.classList.add('activo-perfil');
      btn.setAttribute('aria-current', 'page');
      btn.innerHTML = '<span class="perfil-prompt">&gt;</span> ID:/<span class="perfil-cursor">▮</span>';
    } else {
      btn.innerHTML = '<span class="perfil-prompt">&gt;</span> ID:/perfil';
    }

    document.body.appendChild(btn);
  }

  // ═══════════════════════════════════════════════════════════
  // 3. BOTÓN DE CAMBIO DE TEMA
  // ═══════════════════════════════════════════════════════════
  function crearThemeToggle() {
    var btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Cambiar a modo claro');
    btn.setAttribute('title', 'Cambiar tema (claro/oscuro)');
    btn.innerHTML = '🌓';
    btn.id = 'theme-toggle';

    // Determinar tema inicial
    var temaGuardado = localStorage.getItem('retroterm_tema');
    var prefiereClaro = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (temaGuardado === 'light' || (!temaGuardado && prefiereClaro)) {
      document.documentElement.setAttribute('data-theme', 'light');
      btn.setAttribute('aria-label', 'Cambiar a modo oscuro');
      btn.innerHTML = '🌙';
    }

    btn.addEventListener('click', function() {
      var temaActual = document.documentElement.getAttribute('data-theme');
      if (temaActual === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('retroterm_tema', 'dark');
        btn.setAttribute('aria-label', 'Cambiar a modo claro');
        btn.innerHTML = '🌓';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('retroterm_tema', 'light');
        btn.setAttribute('aria-label', 'Cambiar a modo oscuro');
        btn.innerHTML = '🌙';
      }
    });

    // Atajo de teclado: Alt+T para cambiar tema
    document.addEventListener('keydown', function(e) {
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        btn.click();
      }
    });

    document.body.appendChild(btn);
  }

  // ═══════════════════════════════════════════════════════════
  // 3. NAVEGACIÓN POR TECLADO PARA TARJETAS
  // ═══════════════════════════════════════════════════════════
  function mejorarNavegacionTeclado() {
    // Hacer tarjetas de juego navegables por teclado
    var gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(function(card) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      
      // Permitir Enter para navegar
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = card.getAttribute('href');
        }
      });
    });

    // Hacer tarjetas de proyecto navegables
    var proyectoCards = document.querySelectorAll('.proyecto-card .card-btn');
    proyectoCards.forEach(function(btn) {
      btn.setAttribute('tabindex', '0');
    });

    // Hacer tarjetas de artículos navegables
    var tarjetaLinks = document.querySelectorAll('.tarjeta-link');
    tarjetaLinks.forEach(function(link) {
      link.setAttribute('tabindex', '0');
    });

    // Mejorar botones de volver
    var volverBtns = document.querySelectorAll('.volver, .detalle-volver, .defi-volver, .volver-hub');
    volverBtns.forEach(function(btn) {
      btn.setAttribute('tabindex', '0');
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 4. ROLES ARIA DINÁMICOS
  // ═══════════════════════════════════════════════════════════
  function mejorarRolesARIA() {
    // Añadir role="main" al contenido principal
    var mainSections = document.querySelectorAll('.pantalla.activa, section.activa');
    mainSections.forEach(function(section) {
      if (!section.getAttribute('role')) {
        section.setAttribute('role', 'main');
      }
    });

    // Añadir aria-live a regiones dinámicas
    var chatArea = document.getElementById('chat-area');
    if (chatArea) {
      chatArea.setAttribute('aria-live', 'polite');
      chatArea.setAttribute('aria-relevant', 'additions');
      chatArea.setAttribute('aria-label', 'Mensajes del chat');
    }

    // Añadir aria-live al indicador de escritura
    var typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.setAttribute('aria-live', 'polite');
      typingIndicator.setAttribute('aria-label', 'ARIA está escribiendo');
    }

    // Añadir aria-label a secciones de detalle
    var detalleSections = document.querySelectorAll('.juego-detalle, .defi-detalle');
    detalleSections.forEach(function(section) {
      var titulo = section.querySelector('h2');
      if (titulo && !section.getAttribute('aria-label')) {
        section.setAttribute('aria-label', 'Detalles de ' + titulo.textContent);
      }
    });

    // Mejorar menú hamburguesa
    var menuToggle = document.getElementById('menu-toggle');
    var hamburguesa = document.querySelector('.hamburguesa');
    var menu = document.querySelector('.menu');
    
    if (menuToggle && hamburguesa && menu) {
      hamburguesa.setAttribute('role', 'button');
      hamburguesa.setAttribute('tabindex', '0');
      menu.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-hidden', 'true');

      // Actualizar aria-expanded al abrir/cerrar
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'checked') {
            var isOpen = menuToggle.checked;
            menu.setAttribute('aria-expanded', isOpen.toString());
          }
        });
      });
      observer.observe(menuToggle, { attributes: true });

      // Permitir Enter y Escape en hamburguesa
      hamburguesa.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          menuToggle.checked = !menuToggle.checked;
          menuToggle.dispatchEvent(new Event('change'));
        }
        if (e.key === 'Escape' && menuToggle.checked) {
          e.preventDefault();
          menuToggle.checked = false;
          menuToggle.dispatchEvent(new Event('change'));
          hamburguesa.focus();
        }
      });

      // Cerrar menú con Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuToggle.checked) {
          menuToggle.checked = false;
          menuToggle.dispatchEvent(new Event('change'));
          hamburguesa.focus();
        }
      });
    }

    // Añadir aria-label a iframes sin título
    var iframes = document.querySelectorAll('iframe');
    iframes.forEach(function(iframe) {
      if (!iframe.getAttribute('title')) {
        var src = iframe.getAttribute('src') || '';
        if (src.includes('youtube')) {
          iframe.setAttribute('title', 'Vídeo de YouTube');
        } else {
          iframe.setAttribute('title', 'Contenido incrustado');
        }
      }
    });

    // Añadir aria-label a videos
    var videos = document.querySelectorAll('video');
    videos.forEach(function(video) {
      if (!video.getAttribute('aria-label')) {
        video.setAttribute('aria-label', 'Vídeo de presentación');
      }
    });

    // Mejorar tabla de precios DeFi
    var preciosTabla = document.querySelector('.precios-tabla');
    if (preciosTabla) {
      preciosTabla.setAttribute('role', 'table');
      preciosTabla.setAttribute('aria-label', 'Precios de criptomonedas en tiempo real');
      
      // Añadir scope a headers
      var ths = preciosTabla.querySelectorAll('th');
      ths.forEach(function(th) {
        th.setAttribute('scope', 'col');
      });
    }

    // Mejorar tablas en portal
    var portalTablas = document.querySelectorAll('.articulo table');
    portalTablas.forEach(function(tabla) {
      if (!tabla.getAttribute('role')) {
        tabla.setAttribute('role', 'table');
        var ths = tabla.querySelectorAll('th');
        ths.forEach(function(th) {
          th.setAttribute('scope', 'col');
        });
      }
    });

    // Añadir aria-describedby a inputs sin label
    var codigoInput = document.getElementById('codigo');
    if (codigoInput) {
      codigoInput.setAttribute('aria-label', 'Código secreto de 4 dígitos');
      codigoInput.setAttribute('aria-describedby', 'msgPuzzle');
    }

    var chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.setAttribute('aria-label', 'Escribe tu mensaje para ARIA');
    }

    // Mejorar botones de compartir
    var shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(function(btn) {
      if (!btn.getAttribute('aria-label')) {
        var text = btn.textContent.trim();
        var labels = {
          '𝕏': 'Compartir en X (Twitter)',
          'WA': 'Compartir en WhatsApp',
          'in': 'Compartir en LinkedIn',
          'TG': 'Compartir en Telegram'
        };
        btn.setAttribute('aria-label', labels[text] || 'Compartir en red social');
      }
    });

    // Añadir aria-current a navegación
    var currentHash = window.location.hash || '';
    var navLinks = document.querySelectorAll('.defi-tab, .silo-menu a, .nav-pie a');
    navLinks.forEach(function(link) {
      var href = link.getAttribute('href') || '';
      if (href === currentHash || (currentHash === '' && href.includes('defi.html'))) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('activo');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 5. DETECTAR PREFERENCIA DE MOVIMIENTO
  // ═══════════════════════════════════════════════════════════
  function detectarPreferenciaMovimiento() {
    var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function aplicarPreferencia(e) {
      if (e.matches) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }
    }
    
    aplicarPreferencia(mediaQuery);
    mediaQuery.addEventListener('change', aplicarPreferencia);
  }

  // ═══════════════════════════════════════════════════════════
  // 6. DETECTAR PREFERENCIA DE ALTO CONTRASTE
  // ═══════════════════════════════════════════════════════════
  function detectarPreferenciaContraste() {
    var mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    function aplicarPreferencia(e) {
      if (e.matches) {
        document.documentElement.setAttribute('data-high-contrast', 'true');
      } else {
        document.documentElement.removeAttribute('data-high-contrast');
      }
    }
    
    aplicarPreferencia(mediaQuery);
    mediaQuery.addEventListener('change', aplicarPreferencia);
  }

  // ═══════════════════════════════════════════════════════════
  // 7. MEJORAR ACCESIBILIDAD DEL PUZZLE
  // ═══════════════════════════════════════════════════════════
  function mejorarPuzzle() {
    var puzzleInput = document.getElementById('codigo');
    var puzzleBtn = document.querySelector('#puzzle button');
    var puzzleMsg = document.getElementById('msgPuzzle');

    if (puzzleInput && puzzleBtn) {
      // Permitir Enter para enviar
      puzzleInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          puzzleBtn.click();
        }
      });

      // Anunciar resultado a screen readers
      if (puzzleMsg) {
        puzzleMsg.setAttribute('role', 'status');
        puzzleMsg.setAttribute('aria-live', 'polite');
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 8. MEJORAR ACCESIBILIDAD DE CATEGORÍAS
  // ═══════════════════════════════════════════════════════════
  function mejorarCategorias() {
    var categorias = document.querySelectorAll('.art-cat-titulo');
    categorias.forEach(function(cat) {
      cat.setAttribute('role', 'button');
      cat.setAttribute('tabindex', '0');
      cat.setAttribute('aria-expanded', cat.classList.contains('abierta').toString());

      cat.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cat.click();
          var lista = cat.nextElementSibling;
          var isOpen = cat.classList.contains('abierta');
          cat.setAttribute('aria-expanded', isOpen.toString());
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 9. ANUNCIOS PARA SCREEN READERS
  // ═══════════════════════════════════════════════════════════
  function crearRegionAnuncios() {
    var region = document.createElement('div');
    region.id = 'aria-announcements';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(region);
  }

  function anunciar(mensaje) {
    var region = document.getElementById('aria-announcements');
    if (region) {
      region.textContent = '';
      setTimeout(function() {
        region.textContent = mensaje;
      }, 100);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 10. INICIALIZACIÓN
  // ═══════════════════════════════════════════════════════════
  function init() {
    crearSkipLink();
    crearPerfilBtn();
    crearThemeToggle();
    mejorarNavegacionTeclado();
    mejorarRolesARIA();
    detectarPreferenciaMovimiento();
    detectarPreferenciaContraste();
    mejorarPuzzle();
    mejorarCategorias();
    crearRegionAnuncios();

    // Anunciar carga de página
    setTimeout(function() {
      anunciar('Página cargada correctamente');
    }, 500);
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-ejecutar en hashchange (para SPA con :target)
  window.addEventListener('hashchange', function() {
    setTimeout(function() {
      mejorarRolesARIA();
      mejorarNavegacionTeclado();
    }, 100);
  });

})();