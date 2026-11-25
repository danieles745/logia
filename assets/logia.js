/* LOGIA — utilidades compartidas del sitio */

var LOGIA = {
  /* ===== Marca: cambiar aquí nombre, logo y enlaces ===== */
  MARCA: {
    nombre: 'LOGIA',                 // nombre definitivo de la comunidad
    logo: '',                        // ruta del logo, ej. 'assets/logo.svg'; vacío = emblema provisional
    lema: 'Una comunidad. Un territorio. Una credencial para pertenecer a la Ruta Cervecera de Bogotá.',
    instagram: '',                   // ej. 'https://instagram.com/logia.bogota'
  },
  WHATSAPP: '',                      // enlace del canal de WhatsApp
  GALERIA: [                         // fotos: { src: 'assets/galeria/1.jpg', pie: 'Texto' }
  ],
  // URL de la aplicación web de Apps Script (termina en /exec)
  API_URL: 'https://script.google.com/macros/s/AKfycbyLC4KxzhcCPhMnKTfwFNh46FoDs9Gfkwrn-bks7fBf_yyw6w4t1vKds-oZaooTniVW/exec',
  CONTACTO: 'logia.bogota@gmail.com',
  // Trazo aproximado del Park Way (lat, lng) para el mapa ilustrado
  PARKWAY: [[4.6262, -74.0745], [4.6300, -74.0731], [4.6345, -74.0713], [4.6386, -74.0698]]
};

/* ---------------- API ---------------- */
LOGIA.api = function (accion, datos) {
  var cuerpo = Object.assign({ accion: accion }, datos || {});
  return fetch(LOGIA.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(cuerpo)
  }).then(function (r) { return r.json(); }).then(function (j) {
    if (!j.ok) throw new Error(j.error || 'No se pudo completar.');
    return j.data;
  });
};

/* ---------------- Identidad guardada en el teléfono ---------------- */
LOGIA.guardar = function (m, t) { try { localStorage.setItem('logia_id', JSON.stringify({ m: m, t: t })); } catch (e) {} };
LOGIA.identidad = function () {
  var p = new URLSearchParams(location.search);
  if (p.get('m') && p.get('t')) { LOGIA.guardar(p.get('m'), p.get('t')); return { m: p.get('m'), t: p.get('t') }; }
  try { return JSON.parse(localStorage.getItem('logia_id') || 'null'); } catch (e) { return null; }
};
LOGIA.credUrl = function (id) { return 'credencial.html?m=' + encodeURIComponent(id.m) + '&t=' + encodeURIComponent(id.t); };
LOGIA.base = function () { return location.origin + location.pathname.replace(/[^/]*$/, ''); };
// El QR de la tarjeta abre la vista pública: no contiene el acceso privado del miembro
LOGIA.verUrl = function (c) { return LOGIA.base() + 'ver.html?p=' + encodeURIComponent(c.publico || ''); };

/* ---------------- Utilidades ---------------- */
LOGIA.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
LOGIA.qr = function (texto) {
  var q = qrcode(0, 'M'); q.addData(texto); q.make();
  return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
};
LOGIA.esIOS = function () { return /iPhone|iPad|iPod/i.test(navigator.userAgent); };

/* ---------------- Emblema ---------------- */
LOGIA.emblema = function (color) {
  color = color || '#C9A227';
  var id = 'arc' + Math.random().toString(36).slice(2, 7);
  return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Logia">' +
    '<defs><path id="' + id + '" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"/></defs>' +
    '<circle cx="100" cy="100" r="96" fill="none" stroke="' + color + '" stroke-width="3"/>' +
    '<circle cx="100" cy="100" r="88" fill="none" stroke="' + color + '" stroke-width="1"/>' +
    '<circle cx="100" cy="100" r="58" fill="none" stroke="' + color + '" stroke-width="1"/>' +
    '<text font-family="IBM Plex Sans, sans-serif" font-size="12.5" letter-spacing="4.2" fill="' + color + '">' +
    '<textPath href="#' + id + '" startOffset="0">TEUSAQUILLO · PARKWAY · BOGOTÁ · MMXXVI ·</textPath></text>' +
    '<text x="100" y="121" text-anchor="middle" font-family="DM Serif Display, serif" font-size="66" fill="' + color + '">L</text>' +
    '<path d="M100 52 l4 8 -4 4 -4 -4z M100 148 l4 -8 -4 -4 -4 4z" fill="' + color + '"/>' +
    '</svg>';
};

/* ---------------- Sello estampado ---------------- */
LOGIA.selloSVG = function (local, fecha) {
  var rojo = '#B3261E', id = 'sl' + Math.random().toString(36).slice(2, 7);
  var txt = LOGIA.esc(String(local).toUpperCase().slice(0, 34));
  return '<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">' +
    '<g class="estampar" style="transform-box:fill-box">' +
    '<defs><path id="' + id + '" d="M120,120 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"/></defs>' +
    '<circle cx="120" cy="120" r="112" fill="none" stroke="' + rojo + '" stroke-width="6"/>' +
    '<circle cx="120" cy="120" r="100" fill="none" stroke="' + rojo + '" stroke-width="2"/>' +
    '<circle cx="120" cy="120" r="64" fill="none" stroke="' + rojo + '" stroke-width="2"/>' +
    '<text font-family="IBM Plex Sans, sans-serif" font-weight="600" font-size="15" letter-spacing="3" fill="' + rojo + '">' +
    '<textPath href="#' + id + '" startOffset="50%" text-anchor="middle">' + txt + ' · LOGIA ·</textPath></text>' +
    '<text x="120" y="112" text-anchor="middle" font-family="DM Serif Display, serif" font-size="30" fill="' + rojo + '">SELLADO</text>' +
    '<text x="120" y="140" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="15" fill="' + rojo + '">' + LOGIA.esc(fecha) + '</text>' +
    '</g></svg>';
};

/* ---------------- Mapa ilustrado de la Ruta Cervecera ---------------- */
LOGIA.mapaRuta = function (locales) {
  var W = 400, pad = 34;
  var pts = locales.filter(function (l) { return isFinite(l.lat) && isFinite(l.lng) && l.lat && l.lng; });
  var todos = pts.map(function (l) { return [l.lat, l.lng]; }).concat(LOGIA.PARKWAY);
  var la = todos.map(function (p) { return p[0]; }), ln = todos.map(function (p) { return p[1]; });
  var minLa = Math.min.apply(null, la), maxLa = Math.max.apply(null, la);
  var minLn = Math.min.apply(null, ln), maxLn = Math.max.apply(null, ln);
  var span = Math.max(maxLa - minLa, maxLn - minLn, 0.008);
  var cLa = (minLa + maxLa) / 2, cLn = (minLn + maxLn) / 2;
  var dLa = Math.max(maxLa - minLa, span * 0.75) / 2 * 1.12, dLn = Math.max(maxLn - minLn, span * 0.75) / 2 * 1.12;
  var H = Math.round(Math.min(Math.max((dLa / dLn) * (W - 2 * pad) + 2 * pad, 280), 460));
  function X(lng) { return pad + (lng - (cLn - dLn)) / (2 * dLn) * (W - 2 * pad); }
  function Y(lat) { return H - pad - (lat - (cLa - dLa)) / (2 * dLa) * (H - 2 * pad); }

  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" font-family="IBM Plex Sans, sans-serif">';
  s += '<rect width="' + W + '" height="' + H + '" rx="12" fill="#E8DCC4"/>';
  // manzanas: trama de calles y carreras
  for (var gx = 18; gx < W; gx += 30) s += '<line x1="' + gx + '" y1="0" x2="' + (gx - 10) + '" y2="' + H + '" stroke="#D6C7AA" stroke-width="1.2"/>';
  for (var gy = 16; gy < H; gy += 26) s += '<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + (gy + 4) + '" stroke="#D6C7AA" stroke-width="1.2"/>';
  // Park Way
  var pw = LOGIA.PARKWAY.map(function (p) { return X(p[1]).toFixed(1) + ',' + Y(p[0]).toFixed(1); }).join(' ');
  s += '<polyline points="' + pw + '" fill="none" stroke="#9AAA78" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>';
  s += '<polyline points="' + pw + '" fill="none" stroke="#7E9160" stroke-width="2" stroke-dasharray="1 9" stroke-linecap="round"/>';
  var a = LOGIA.PARKWAY[2], b = LOGIA.PARKWAY[3];
  var ang = Math.atan2(Y(b[0]) - Y(a[0]), X(b[1]) - X(a[1])) * 180 / Math.PI;
  var mx = (X(a[1]) + X(b[1])) / 2, my = (Y(a[0]) + Y(b[0])) / 2;
  s += '<text x="' + mx.toFixed(1) + '" y="' + (my + 4).toFixed(1) + '" transform="rotate(' + ang.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1) + ')" text-anchor="middle" font-size="10" letter-spacing="4" fill="#4E5C37" font-weight="600">PARK WAY</text>';
  // ruta
  if (pts.length > 1) {
    var ruta = pts.map(function (l) { return X(l.lng).toFixed(1) + ',' + Y(l.lat).toFixed(1); }).join(' ');
    s += '<polyline points="' + ruta + '" fill="none" stroke="#8E7524" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round"/>';
  }
  // locales
  pts.forEach(function (l, i) {
    var x = X(l.lng), y = Y(l.lat), n = locales.indexOf(l) + 1;
    if (l.visitado) {
      s += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(-10)">' +
        '<circle r="17" fill="#B3261E"/><circle r="13.5" fill="none" stroke="#F3EBDD" stroke-width="1.2"/>' +
        '<text y="4.5" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="600" fill="#F3EBDD">' + n + '</text></g>';
    } else {
      s += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')">' +
        '<circle r="15" fill="#F3EBDD" stroke="#7A6F5F" stroke-width="1.6" stroke-dasharray="3 3"/>' +
        '<text y="4.5" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="600" fill="#7A6F5F">' + n + '</text></g>';
    }
  });
  // rosa de los vientos y cartela
  s += '<g transform="translate(' + (W - 30) + ' 34)"><circle r="15" fill="none" stroke="#7A6F5F"/><path d="M0 -12 L4 0 L0 12 L-4 0Z" fill="#7A6F5F"/><path d="M0 -12 L4 0 L-4 0Z" fill="#B3261E"/><text y="-19" text-anchor="middle" font-size="9" fill="#7A6F5F" font-weight="600">N</text></g>';
  s += '<g transform="translate(14 ' + (H - 14) + ')"><rect x="0" y="-20" width="206" height="24" rx="4" fill="#121110"/><text x="10" y="-4" font-size="9.5" letter-spacing="3" fill="#C9A227">TEUSAQUILLO · BOGOTÁ</text></g>';
  s += '</svg>';
  return s;
};

LOGIA.listaRuta = function (locales) {
  return locales.map(function (l, i) {
    var ir = (l.lat && l.lng) ? 'https://www.google.com/maps/dir/?api=1&destination=' + l.lat + ',' + l.lng
                              : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(l.direccion);
    return '<li class="' + (l.visitado ? 'ok' : '') + '"><div class="num">' + (l.visitado ? '✓' : (i + 1)) + '</div>' +
      '<div class="info"><b>' + LOGIA.esc(l.nombre) + '</b><small>' +
      (l.visitado ? 'Sellado el ' + LOGIA.esc(l.visitado) : LOGIA.esc(l.direccion)) + '</small></div>' +
      '<a class="ir" href="' + ir + '" target="_blank" rel="noopener">Cómo llegar →</a></li>';
  }).join('');
};

/* ---------------- Orden de la ruta (recorrido a pie más corto aproximado) ---------------- */
LOGIA.ordenRuta = function (locales) {
  var con = locales.filter(function (l) { return l.lat && l.lng; }), sin = locales.filter(function (l) { return !(l.lat && l.lng); });
  if (!con.length) return locales;
  con.sort(function (a, b) { return a.lat - b.lat; });
  var ruta = [con.shift()];
  while (con.length) {
    var u = ruta[ruta.length - 1], k = 0, dmin = Infinity;
    con.forEach(function (l, i) { var d = Math.pow(l.lat - u.lat, 2) + Math.pow(l.lng - u.lng, 2); if (d < dmin) { dmin = d; k = i; } });
    ruta.push(con.splice(k, 1)[0]);
  }
  return ruta.concat(sin);
};
LOGIA.fechaCorta = function (f) {
  var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(f || ''));
  if (!m) return String(f || '');
  var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return (+m[3]) + ' de ' + meses[+m[2] - 1];
};
LOGIA.mesAnio = function (f) {
  var m = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  var p = String(f || '').split('-'); return p.length > 1 ? m[parseInt(p[1], 10) - 1] + ' ' + p[0] : f;
};

/* ---------------- Mapa satelital (Leaflet + Esri World Imagery) ---------------- */
LOGIA._mapas = [];
LOGIA.contenedorMapa = function (locales, alto) {
  LOGIA._mapas.push(locales);
  return '<div class="mapa-sat" data-mapa="' + (LOGIA._mapas.length - 1) + '" style="height:' + (alto || 380) + 'px"></div>';
};
LOGIA.activarMapas = function () {
  document.querySelectorAll('.mapa-sat[data-mapa]').forEach(function (el) {
    var locales = LOGIA._mapas[+el.getAttribute('data-mapa')];
    el.removeAttribute('data-mapa');
    LOGIA.mapaSatelital(el, locales || []);
  });
};
LOGIA.mapaSatelital = function (el, locales) {
  var pts = LOGIA.ordenRuta(locales).filter(function (l) { return l.lat && l.lng; });
  if (typeof L === 'undefined' || !pts.length) { el.innerHTML = LOGIA.mapaRuta(locales); el.style.height = 'auto'; return; }
  var map = L.map(el, { scrollWheelZoom: false, tap: true, attributionControl: true, zoomControl: true });
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, attribution: 'Powered by Esri · Imágenes: Esri, Maxar, Earthstar Geographics y GIS User Community'
  }).addTo(map);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, opacity: 0.55
  }).addTo(map);
  if (pts.length > 1) {
    L.polyline(pts.map(function (l) { return [l.lat, l.lng]; }), { color: '#C9A227', weight: 3, dashArray: '6 8', opacity: .95 }).addTo(map);
  }
  pts.forEach(function (l) {
    var n = LOGIA.ordenRuta(locales).indexOf(l) + 1;
    var html = '<div class="pin' + (l.visitado ? ' pin-ok' : '') + '"><span>' + (l.visitado ? '✓' : n) + '</span></div>';
    var icon = L.divIcon({ className: 'pin-wrap', html: html, iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -18] });
    var ir = 'https://www.google.com/maps/dir/?api=1&destination=' + l.lat + ',' + l.lng;
    L.marker([l.lat, l.lng], { icon: icon, title: l.nombre }).addTo(map).bindPopup(
      '<div class="pop"><b>' + LOGIA.esc(l.nombre) + '</b><small>' + LOGIA.esc(l.direccion || '') + '</small>' +
      (l.distintivo ? '<em>' + LOGIA.esc(l.distintivo) + '</em>' : '') +
      (l.visitado ? '<i>Sellado el ' + LOGIA.esc(l.visitado) + '</i>' : '') +
      '<a href="' + ir + '" target="_blank" rel="noopener">Cómo llegar →</a></div>');
  });
  if (pts.length === 1) map.setView([pts[0].lat, pts[0].lng], 17);
  else map.fitBounds(L.latLngBounds(pts.map(function (l) { return [l.lat, l.lng]; })), { padding: [48, 48], maxZoom: 18 });
  setTimeout(function () { map.invalidateSize(); }, 200);
  return map;
};

/* ---------------- Wallet: enlace según el teléfono ---------------- */
LOGIA.enlaceWallet = function (c) {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return c.apple || '';
  if (/Android/i.test(navigator.userAgent)) return c.google || c.apple || '';
  return '';
};

/* ¿El pase ya está en el Wallet de este teléfono? Lo sabe el servidor (Apple confirma la instalación
   cuando le llega una actualización) o este teléfono (el miembro lo agregó o dijo que ya lo tiene). */
LOGIA.tieneWallet = function (c) {
  if (c && c.enWallet) return true;
  try { return localStorage.getItem('logia_wallet') === String(c && c.id); } catch (e) { return false; }
};
LOGIA.marcarWallet = function (c) { try { localStorage.setItem('logia_wallet', String(c.id)); } catch (e) {} };
/* Abre la app del Wallet con el pase. iPhone: la app Wallet. Android: Google Wallet muestra el pase ya guardado. */
LOGIA.abrirWallet = function (c) {
  if (LOGIA.esIOS()) { location.href = 'shoebox://'; return true; }
  if (/Android/i.test(navigator.userAgent) && c.google) { location.href = c.google; return true; }
  return false;
};

/* ---------------- Marca ---------------- */
LOGIA.logoHTML = function () {
  return LOGIA.MARCA.logo ? '<img src="' + LOGIA.MARCA.logo + '" alt="' + LOGIA.esc(LOGIA.MARCA.nombre) + '">' : LOGIA.emblema();
};

/* ---------------- Tarjeta completa ---------------- */
LOGIA.tarjetaSola = function (c) {
  c.locales = LOGIA.ordenRuta(c.locales);
  var total = c.locales.length, hechos = c.locales.filter(function (l) { return l.visitado; }).length;
  var url = LOGIA.verUrl(c);
  return '<div class="tarjeta">' +
    '<div class="t-cab"><div><div class="t-marca">' + LOGIA.esc(LOGIA.MARCA.nombre) + '</div><div class="t-mini">BOGOTÁ · COLOMBIA</div></div>' +
    '<div class="t-logo">' + LOGIA.logoHTML() + '</div></div>' +
    '<div class="t-banda"></div>' +
    '<div class="t-cuerpo"><div class="t-datos">' +
      '<span class="t-cat">' + LOGIA.esc(c.categoria.toUpperCase()) + '</span>' +
      '<div class="t-nombre">' + LOGIA.esc(c.alias) + '</div>' +
      '<div class="t-campos">' +
        '<div class="t-campo"><span>MIEMBRO No.</span><b>' + LOGIA.esc(c.id) + '</b></div>' +
        '<div class="t-campo"><span>DESDE</span><b>' + LOGIA.esc(LOGIA.mesAnio(c.desde)) + '</b></div>' +
        '<div class="t-campo"><span>CIUDAD</span><b>' + LOGIA.esc(c.ciudad) + '</b></div>' +
        '<div class="t-campo"><span>SELLOS</span><b>' + hechos + ' / ' + total + '</b></div>' +
      '</div></div>' +
      '<div class="t-qr">' + LOGIA.qr(url) + '</div></div>' +
    '<div class="t-pie"><span>PASAPORTE · RUTA CERVECERA</span><b>' + hechos + ' / ' + total + '</b></div>' +
    '<div class="progreso"><i style="width:' + (total ? Math.round(hechos / total * 100) : 0) + '%"></i></div>' +
    '</div>';
};

LOGIA.tarjeta = function (c) {
  var html = LOGIA.tarjetaSola(c);
  var total = c.locales.length, hechos = c.locales.filter(function (l) { return l.visitado; }).length;
  return html +
    '<section class="ruta"><div class="ruta-cab"><h2>Ruta Cervecera</h2><span>' + hechos + ' DE ' + total + ' SELLOS</span></div>' +
    '<div class="mapa">' + LOGIA.contenedorMapa(c.locales, 340) + '</div>' +
    '<ul class="lista">' + LOGIA.listaRuta(c.locales) + '</ul></section>';
};

/* Código de recuperación: oculto hasta que el miembro lo pide */
LOGIA.bloqueCodigo = function (c) {
  if (!c.codigo) return '';
  return '<div class="codigo-rec"><span>CÓDIGO PARA ABRIR TU CREDENCIAL EN OTRO TELÉFONO</span>' +
    '<b id="codRec" data-c="' + LOGIA.esc(c.codigo) + '">••••••</b>' +
    '<button type="button" onclick="var e=document.getElementById(\'codRec\');var v=e.textContent.indexOf(\'•\')>-1;e.textContent=v?e.dataset.c:\'••••••\';this.textContent=v?\'Ocultar\':\'Mostrar\';">Mostrar</button>' +
    '<small>No lo compartas. Tu QR sí lo puedes mostrar: solo abre tu vista pública.</small></div>';
};

LOGIA.botonesWallet = function (c) {
  LOGIA._c = c;
  var movil = LOGIA.esIOS() || /Android/i.test(navigator.userAgent);
  if (movil && LOGIA.tieneWallet(c)) {
    return '<a class="btn btn-wallet" href="#" onclick="LOGIA.abrirWallet(LOGIA._c);return false">Abrir mi pasaporte en el Wallet</a>' +
      '<p class="nota" style="text-align:center">¿No aparece en tu Wallet? <a href="' + (LOGIA.enlaceWallet(c) || c.apple) + '">Agrégalo de nuevo</a></p>';
  }
  var marca = ' onclick="LOGIA.marcarWallet(LOGIA._c)"';
  var apple = c.apple ? '<a class="btn btn-wallet" href="' + c.apple + '"' + marca + '>Agregar a Apple Wallet</a>' : '';
  var google = c.google ? '<a class="btn btn-wallet" href="' + c.google + '"' + marca + '>Agregar a Google Wallet</a>' : '';
  return LOGIA.esIOS() ? apple + google : google + apple;
};
