// TIMEX / PDF TIMEX -> VISOR bridge (postMessage + BroadcastChannel)
(() => {
  const VISOR_URL = './visor.html';
  let visorWin = null;
  let bc = null;

  try{ bc = new BroadcastChannel('VISOR_CHANNEL'); }catch(e){ bc = null; }

  function openVisor() {
    // Intento abrir (si el navegador lo permite). Si está bloqueado, BroadcastChannel seguirá funcionando.
    try{
      if (!visorWin || visorWin.closed) {
        visorWin = window.open(VISOR_URL, 'VISOR', 'width=1100,height=750');
      } else {
        // Si ya existe, aseguramos foco
        try{ visorWin.focus(); }catch(_){}
      }
    }catch(_){}
    return visorWin;
  }

  function sendToVisor(payload) {
    // BroadcastChannel (principal)
    if (bc) {
      try{ bc.postMessage({ type: 'VISOR_MARKER', payload }); }catch(_){}
    }
    // postMessage (extra)
    const w = openVisor();
    if (w) {
      try{ w.postMessage({ type: 'VISOR_MARKER', payload }, '*'); }catch(_){}
    }
  }

  window.TIMEX_VISOR = { openVisor, sendToVisor };

  // Evento custom desde cualquier página: dispatchEvent(new CustomEvent('VISOR_SEND',{detail:{estado,lat,lng,label}}))
  window.addEventListener('VISOR_SEND', (e) => {
    const d = e && e.detail;
    if (!d) return;
    sendToVisor(d);
  });

  // Fallback por atributos: data-estado + data-lat + data-lng
  document.addEventListener('click', (e) => {
    const t = e.target && e.target.closest ? e.target.closest('[data-estado][data-lat][data-lng]') : null;
    if (!t) return;

    const estado = String(t.getAttribute('data-estado') || '').toUpperCase().trim();
    const lat = Number(t.getAttribute('data-lat'));
    const lng = Number(t.getAttribute('data-lng'));
    const label = t.getAttribute('data-label') || t.textContent || 'Punto';

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    sendToVisor({ estado, lat, lng, label });
  });
})();
