/**
 * RETROTERM.AI — Sistema de Distribuciones v1.0 [ALPHA]
 * Permite al usuario cambiar la distribución del HUB entre
 * tres modos predefinidos: BENTO · MATRIX · FOCUS
 *
 * Solo activo en index.html (verifica existencia de .bento).
 * Aplica data-layout al <html> inmediatamente para evitar flash.
 */
(function () {
  'use strict';

  /* ── Definición de layouts ────────────────────────────────── */
  var LAYOUTS = {
    bento: {
      name: 'BENTO',
      desc: 'Asimétrico',
      badge: null
    },
    matrix: {
      name: 'MATRIX',
      desc: 'Uniforme',
      badge: 'BETA'
    },
    focus: {
      name: 'FOCUS',
      desc: 'Terminal',
      badge: 'ALPHA'
    }
  };

  /* ── Aplicar layout ──────────────────────────────────────── */
  function applyLayout(name, save) {
    if (!LAYOUTS[name]) name = 'bento';
    document.documentElement.setAttribute('data-layout', name);
    if (save !== false) localStorage.setItem('rt-layout', name);
    _updateWidget(name);
  }

  function _saved() {
    return localStorage.getItem('rt-layout') || 'bento';
  }

  /* ── Actualizar estado visual del widget ─────────────────── */
  function _updateWidget(name) {
    var l = LAYOUTS[name] || LAYOUTS.bento;
    var nameEl = document.getElementById('rl-name');
    if (nameEl) nameEl.textContent = l.name;
    var opts = document.querySelectorAll('[data-rl]');
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle('rl-on', opts[i].getAttribute('data-rl') === name);
    }
  }

  /* ── Inyectar widget ─────────────────────────────────────── */
  function _inject() {
    /* Solo en páginas con bento grid */
    if (!document.querySelector('.bento')) return;
    if (document.getElementById('rl-w')) return;

    /* Estilos inline del widget */
    var s = document.createElement('style');
    s.textContent =
      '#rl-w{position:fixed;bottom:52px;left:14px;z-index:9500;font-family:"Courier New",monospace;font-size:.68rem;letter-spacing:1.5px;user-select:none}' +
      '#rl-btn{display:flex;align-items:center;gap:7px;padding:6px 11px;background:rgba(0,0,0,.88);border:1px solid var(--c-border);color:var(--c-pri);cursor:pointer;transition:border-color .2s,box-shadow .2s;backdrop-filter:blur(4px);white-space:nowrap}' +
      '#rl-btn:hover{border-color:var(--c-pri);box-shadow:0 0 10px var(--c-pri-dim)}' +
      '#rl-ico{opacity:.4;font-size:.7rem}' +
      '#rl-arr{opacity:.45;font-size:.55rem;transition:transform .2s;margin-left:2px}' +
      '#rl-w.open #rl-arr{transform:rotate(180deg)}' +
      '#rl-menu{display:none;position:absolute;bottom:calc(100% + 5px);left:0;min-width:158px;background:rgba(0,0,0,.93);border:1px solid var(--c-border);backdrop-filter:blur(8px);overflow:hidden}' +
      '#rl-w.open #rl-menu{display:block}' +
      '#rl-head{padding:5px 11px 4px;font-size:.55rem;color:var(--c-dim);letter-spacing:2px;border-bottom:1px solid var(--c-border)}' +
      '.rl-opt{display:flex;align-items:center;gap:8px;width:100%;padding:7px 11px;background:none;border:none;border-bottom:1px solid var(--c-border);color:var(--c-alt);cursor:pointer;font-family:"Courier New",monospace;font-size:.65rem;letter-spacing:1.5px;text-align:left;transition:background .15s;opacity:.55}' +
      '.rl-opt:last-child{border-bottom:none}' +
      '.rl-opt:hover,.rl-opt.rl-on{background:var(--c-scan);opacity:1;color:var(--c-pri)}' +
      '.rl-sub{font-size:.48rem;opacity:.5;margin-left:auto;letter-spacing:1px}' +
      '.rl-badge{font-size:.44rem;padding:1px 4px;border:1px solid currentColor;opacity:.45;letter-spacing:1px;margin-left:4px}';
    document.head.appendChild(s);

    /* Construir opciones */
    var names = Object.keys(LAYOUTS);
    var rows = '';
    for (var i = 0; i < names.length; i++) {
      var k = names[i];
      var l = LAYOUTS[k];
      var bdg = l.badge ? '<span class="rl-badge">' + l.badge + '</span>' : '';
      rows += '<button class="rl-opt" data-rl="' + k + '">' +
        l.name + bdg +
        '<span class="rl-sub">' + l.desc + '</span>' +
      '</button>';
    }

    /* Widget HTML */
    var w = document.createElement('div');
    w.id = 'rl-w';
    w.innerHTML =
      '<div id="rl-menu"><div id="rl-head">// DISTRIBUCIÓN HUB</div>' + rows + '</div>' +
      '<button id="rl-btn" title="Cambiar distribución del HUB">' +
        '<span id="rl-ico">⊞</span>' +
        '<span id="rl-name">BENTO</span>' +
        '<span id="rl-arr">▾</span>' +
      '</button>';
    document.body.appendChild(w);

    /* Eventos */
    document.getElementById('rl-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      w.classList.toggle('open');
    });

    var opts = w.querySelectorAll('[data-rl]');
    for (var j = 0; j < opts.length; j++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          applyLayout(btn.getAttribute('data-rl'));
          w.classList.remove('open');
        });
      })(opts[j]);
    }

    document.addEventListener('click', function (e) {
      if (!w.contains(e.target)) w.classList.remove('open');
    });

    _updateWidget(_saved());
  }

  /* ── Aplicar inmediatamente (evita flash de layout incorrecto) */
  applyLayout(_saved(), false);

  /* ── Inyectar widget cuando el DOM esté listo ─────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _inject);
  } else {
    _inject();
  }

  /* ── API pública ─────────────────────────────────────────── */
  window.RL = { apply: applyLayout, layouts: LAYOUTS };

})();
