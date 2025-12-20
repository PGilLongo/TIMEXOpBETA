// TIMEX / PDF TIMEX -> VISOR bridge (solo BroadcastChannel; NO abre VISOR)
(() => {
  let bc = null;
  try{ bc = new BroadcastChannel('VISOR_CHANNEL'); }catch(e){ bc = null; }

  function sendToVisor(payload){
    if(!bc) return;
    try{ bc.postMessage({ type: 'VISOR_MARKER', payload }); }catch(_){}
  }

  window.TIMEX_VISOR = { sendToVisor };

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
    const color = t.getAttribute('data-color') || null;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    sendToVisor({ estado, lat, lng, label, color });
  });
})();
