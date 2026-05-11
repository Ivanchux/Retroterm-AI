/**
 * RETROTERM.AI — Sistema de Temas v1.0
 * Gestiona colores globales mediante CSS custom properties.
 * Incluye widget flotante con selector de tema.
 *
 * Uso: <script src="js/theme.js"></script> en <head> de cada página.
 */
(function () {
  'use strict';

  /* ── Definición de temas ─────────────────────────────────── */
  var THEMES = {
    fosforo: {
      name: 'FÓSFORO',
      badge: null,
      vars: {
        '--c-pri':     '#00ff66',
        '--c-alt':     '#66ffb3',
        '--c-border':  '#003300',
        '--c-panel':   '#001800',
        '--c-dim':     '#006633',
        '--c-hover':   '#00aa44',
        '--c-bg-sub':  'rgba(0,20,0,0.8)',
        '--c-scan':    'rgba(0,255,102,0.05)',
        '--c-pri-dim': 'rgba(0,255,102,0.33)',
        '--canvas-hue':'0deg',
      }
    },
    ambar: {
      name: 'ÁMBAR',
      badge: 'BETA',
      vars: {
        '--c-pri':     '#ffb000',
        '--c-alt':     '#ffd566',
        '--c-border':  '#332200',
        '--c-panel':   '#1a0e00',
        '--c-dim':     '#664400',
        '--c-hover':   '#cc8800',
        '--c-bg-sub':  'rgba(20,10,0,0.8)',
        '--c-scan':    'rgba(255,176,0,0.05)',
        '--c-pri-dim': 'rgba(255,176,0,0.33)',
        '--canvas-hue':'-102deg',
      }
    },
    hielo: {
      name: 'HIELO',
      badge: 'BETA',
      vars: {
        '--c-pri':     '#3399ff',
        '--c-alt':     '#66bbff',
        '--c-border':  '#001833',
        '--c-panel':   '#000f1a',
        '--c-dim':     '#003366',
        '--c-hover':   '#0066cc',
        '--c-bg-sub':  'rgba(0,8,20,0.8)',
        '--c-scan':    'rgba(51,153,255,0.05)',
        '--c-pri-dim': 'rgba(51,153,255,0.33)',
        '--canvas-hue':'69deg',
      }
    },
    rojo: {
      name: 'ROJO',
      badge: 'ALPHA',
      vars: {
        '--c-pri':     '#ff3333',
        '--c-alt':     '#ff8888',
        '--c-border':  '#330000',
        '--c-panel':   '#150000',
        '--c-dim':     '#660000',
        '--c-hover':   '#cc2222',
        '--c-bg-sub':  'rgba(20,0,0,0.8)',
        '--c-scan':    'rgba(255,51,51,0.05)',
        '--c-pri-dim': 'rgba(255,51,51,0.33)',
        '--canvas-hue':'216deg',
      }
    }
  };

  /* ── Aplicar tema ────────────────────────────────────────── */
  function applyTheme(name, save) {
    var t = THEMES[name];
    if (!t) { name = 'fosforo'; t = THEMES.fosforo; }
    var root = document.documentElement;
    var keys = Object.keys(t.vars);
    for (var i = 0; i < keys.length; i++) {
      root.style.setProperty(keys[i], t.vars[keys[i]]);
    }
    root.setAttribute('data-color', name);
    if (save !== false) localStorage.setItem('rt-theme', name);
    _updateWidget(name);
  }

  function _saved() {
    return localStorage.getItem('rt-theme') || 'fosforo';
  }

  /* ── Actualizar estado visual del widget ─────────────────── */
  function _updateWidget(name) {
    var t = THEMES[name] || THEMES.fosforo;
    var nameEl = document.getElementById('rt-tn');
    var dotEl  = document.getElementById('rt-td');
    if (nameEl) nameEl.textContent = t.name;
    if (dotEl)  { dotEl.style.background = t.vars['--c-pri']; dotEl.style.boxShadow = '0 0 6px ' + t.vars['--c-pri']; }
    var opts = document.querySelectorAll('[data-rt]');
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle('rt-on', opts[i].getAttribute('data-rt') === name);
    }
  }

  /* ── Inyectar widget en el DOM ───────────────────────────── */
  function _inject() {
    if (document.getElementById('rt-w')) return;

    /* Estilos inline del widget */
    var s = document.createElement('style');
    s.textContent =
      '#rt-w{position:fixed;bottom:14px;left:14px;z-index:9500;font-family:"Courier New",monospace;font-size:.68rem;letter-spacing:1.5px;user-select:none}' +
      '#rt-btn{display:flex;align-items:center;gap:7px;padding:6px 11px;background:rgba(0,0,0,.88);border:1px solid var(--c-border);color:var(--c-pri);cursor:pointer;transition:border-color .2s,box-shadow .2s;backdrop-filter:blur(4px);white-space:nowrap}' +
      '#rt-btn:hover{border-color:var(--c-pri);box-shadow:0 0 10px var(--c-pri-dim)}' +
      '#rt-td{width:7px;height:7px;border-radius:50%;flex-shrink:0;transition:background .3s,box-shadow .3s}' +
      '#rt-arr{opacity:.45;font-size:.55rem;transition:transform .2s;margin-left:2px}' +
      '#rt-w.open #rt-arr{transform:rotate(180deg)}' +
      '#rt-menu{display:none;position:absolute;bottom:calc(100% + 5px);left:0;min-width:158px;background:rgba(0,0,0,.93);border:1px solid var(--c-border);backdrop-filter:blur(8px);overflow:hidden}' +
      '#rt-w.open #rt-menu{display:block}' +
      '#rt-head{padding:5px 11px 4px;font-size:.55rem;color:var(--c-dim);letter-spacing:2px;border-bottom:1px solid var(--c-border)}' +
      '.rt-opt{display:flex;align-items:center;gap:8px;width:100%;padding:7px 11px;background:none;border:none;border-bottom:1px solid var(--c-border);color:var(--c-alt);cursor:pointer;font-family:"Courier New",monospace;font-size:.65rem;letter-spacing:1.5px;text-align:left;transition:background .15s;opacity:.55}' +
      '.rt-opt:last-child{border-bottom:none}' +
      '.rt-opt:hover,.rt-opt.rt-on{background:var(--c-scan);opacity:1;color:var(--c-pri)}' +
      '.rt-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}' +
      '.rt-badge{font-size:.48rem;padding:1px 4px;border:1px solid currentColor;opacity:.5;letter-spacing:1px;margin-left:auto}';
    document.head.appendChild(s);

    /* Construir opciones */
    var names = Object.keys(THEMES);
    var rows = '';
    for (var i = 0; i < names.length; i++) {
      var k = names[i];
      var th = THEMES[k];
      var bdg = th.badge ? '<span class="rt-badge">' + th.badge + '</span>' : '';
      rows += '<button class="rt-opt" data-rt="' + k + '">' +
        '<span class="rt-dot" style="background:' + th.vars['--c-pri'] + ';box-shadow:0 0 4px ' + th.vars['--c-pri'] + '"></span>' +
        th.name + bdg + '</button>';
    }

    /* Widget HTML */
    var w = document.createElement('div');
    w.id = 'rt-w';
    w.innerHTML =
      '<div id="rt-menu"><div id="rt-head">// MODO DE COLOR</div>' + rows + '</div>' +
      '<button id="rt-btn" title="Cambiar tema del sistema">' +
        '<span id="rt-td"></span>' +
        '<span id="rt-tn">—</span>' +
        '<span id="rt-arr">▾</span>' +
      '</button>';
    document.body.appendChild(w);

    /* Eventos */
    document.getElementById('rt-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      w.classList.toggle('open');
    });

    var opts = w.querySelectorAll('[data-rt]');
    for (var j = 0; j < opts.length; j++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          applyTheme(btn.getAttribute('data-rt'));
          w.classList.remove('open');
        });
      })(opts[j]);
    }

    document.addEventListener('click', function (e) {
      if (!w.contains(e.target)) w.classList.remove('open');
    });

    _updateWidget(_saved());
  }

  /* ── Aplicar inmediatamente (sin esperar DOM, evita flash) ── */
  applyTheme(_saved(), false);

  /* ── Inyectar widget cuando el DOM esté listo ─────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _inject);
  } else {
    _inject();
  }

  /* ── API pública ─────────────────────────────────────────── */
  window.RT = { apply: applyTheme, themes: THEMES };

})();
