'use client';

import { useEffect, useRef, useState } from 'react';

const HERO = '/hero.png';
const ICON = '/icon-192.png';

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f0eb' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#3d1000' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e8d8c8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffe4c8' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e85d04' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#b8d4e8' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1e6fae' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4e8c8' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#f0e8e0' }] },
];

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Splash mínimo — 1.8s para que se vea
    const t = setTimeout(() => setSplashDone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!splashDone) return;
    const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
    if (!KEY) { setMapLoaded(true); return; }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&callback=__bibBibInitMap`;
    script.async = true;
    script.defer = true;

    (window as any).__bibBibInitMap = () => {
      if (!mapRef.current) return;
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: { lat: 21.1619, lng: -86.8515 },
        zoom: 14,
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: 'greedy',
        backgroundColor: '#f5f0eb',
      });
      setMapLoaded(true);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          map.setCenter(loc);
          map.setZoom(15);
          new (window as any).google.maps.Marker({
            position: loc, map,
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 10, fillColor: '#e85d04', fillOpacity: 1,
              strokeColor: '#fff', strokeWeight: 3,
            },
          });
        });
      }
    };

    document.head.appendChild(script);
    return () => {
      try { document.head.removeChild(script); } catch {}
    };
  }, [splashDone]);

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden', background: '#f5f0eb' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.85)} 50%{opacity:1;transform:scale(1)} }
        @keyframes ripple { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.8);opacity:0} }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        .fade-up-1 { animation: fadeUp .5s .1s both; }
        .fade-up-2 { animation: fadeUp .5s .25s both; }
        .fade-up-3 { animation: fadeUp .5s .4s both; }
        .fade-up-4 { animation: fadeUp .5s .55s both; }
        .fade-up-5 { animation: fadeUp .5s .7s both; }
        .sheet-in { animation: slideUp .45s .3s cubic-bezier(.32,.72,0,1) both; }
        .btn-tap:active { transform: scale(.96); }
      `}</style>

      {/* SPLASH */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: '#fff8f0',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
        transition: 'opacity .5s ease, transform .5s ease',
        opacity: splashDone ? 0 : 1,
        transform: splashDone ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: splashDone ? 'none' : 'auto',
      }}>
        <div style={{ position: 'relative' }}>
          {/* Ripple */}
          {[0,1].map(i => (
            <div key={i} style={{
              position: 'absolute', inset: -20, borderRadius: '50%',
              border: '2px solid rgba(232,93,4,0.3)',
              animation: `ripple 2s ${i*1}s ease-out infinite`,
            }} />
          ))}
          <img src={ICON} alt="Bib-Bib" style={{
            width: 96, height: 96, borderRadius: 24, objectFit: 'cover',
            boxShadow: '0 12px 40px rgba(232,93,4,0.35)',
            position: 'relative', zIndex: 1,
          }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 28, fontWeight: 900, color: '#3d1000', margin: '0 0 4px', letterSpacing: -0.5 }}>Bib-Bib</p>
          <p style={{ fontSize: 13, color: 'rgba(61,16,0,0.45)', margin: 0, letterSpacing: 1 }}>SERVICIO A DOMICILIO</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: '#e85d04',
              animation: `pulse 1.4s ${i*.2}s ease-in-out infinite` }} />
          ))}
        </div>
      </div>

      {/* MAPA — fondo claro */}
      <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#f5f0eb',
        opacity: mapLoaded ? 1 : 0, transition: 'opacity .6s ease' }} />

      {/* Mapa placeholder mientras carga */}
      {!mapLoaded && splashDone && (
        <div style={{ position: 'absolute', inset: 0, background: '#f5f0eb',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid rgba(232,93,4,0.2)',
            borderTop: '3px solid #e85d04', borderRadius: '50%',
            animation: 'pulse 1s linear infinite' }} />
        </div>
      )}

      {/* HEADER flotante */}
      {splashDone && (
        <div className="fade-up-1" style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          paddingTop: 'env(safe-area-inset-top, 12px)', zIndex: 20,
        }}>
          <div style={{
            margin: '8px 12px 0',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
            borderRadius: 16, padding: '10px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 4px 24px rgba(107,26,26,0.1)',
            border: '1px solid rgba(232,93,4,0.12)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={ICON} alt="" style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover' }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 900, color: '#3d1000', margin: 0, lineHeight: 1 }}>Bib-Bib</p>
                <p style={{ fontSize: 10, color: 'rgba(61,16,0,0.45)', margin: 0 }}>Cancún · En línea</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href="/login" className="btn-tap" style={{
                border: '1.5px solid rgba(232,93,4,0.3)', borderRadius: 10,
                padding: '6px 14px', color: '#c94e03',
                fontSize: 12, fontWeight: 700, textDecoration: 'none',
                background: 'rgba(232,93,4,0.05)',
                transition: 'all .15s',
              }}>Entrar</a>
              <a href="/registro" className="btn-tap" style={{
                background: 'linear-gradient(135deg,#e85d04,#f4a100)',
                borderRadius: 10, padding: '6px 14px', color: 'white',
                fontSize: 12, fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 3px 14px rgba(232,93,4,0.4)',
                transition: 'all .15s',
              }}>Registrarme</a>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET */}
      {splashDone && (
        <div className="sheet-in" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(30px)',
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: '14px 16px 20px',
            boxShadow: '0 -8px 40px rgba(107,26,26,0.12)',
            border: '1px solid rgba(232,93,4,0.08)',
          }}>
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: 'rgba(232,93,4,0.2)',
              borderRadius: 2, margin: '0 auto 16px', borderRadius: 99 }} />

            {/* Hero banner pequeño */}
            <div className="fade-up-2" style={{
              borderRadius: 16, overflow: 'hidden', marginBottom: 14, height: 100, position: 'relative',
            }}>
              <img src={HERO} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.85)' }} />
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(107,26,26,0.7) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                <p style={{ fontSize: 16, fontWeight: 900, color: 'white', margin: 0 }}>Tu mandado en minutos</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>Cancún y zona hotelera</p>
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10,
                background: '#e85d04', borderRadius: 8, padding: '3px 8px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'white' }}>🟢 Activo</span>
              </div>
            </div>

            {/* Barra búsqueda */}
            <button className="fade-up-3 btn-tap" onClick={() => setShowPrompt(true)} style={{
              width: '100%', background: '#faf5f0',
              border: '1.5px solid rgba(232,93,4,0.2)', borderRadius: 16,
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', textAlign: 'left', marginBottom: 12,
              boxShadow: '0 2px 12px rgba(232,93,4,0.08)',
              transition: 'all .15s',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg,#e85d04,#f4a100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(232,93,4,0.35)',
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" width="20" height="20">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#3d1000', margin: 0 }}>
                  ¿A dónde va tu mandado?
                </p>
                <p style={{ fontSize: 11, color: 'rgba(61,16,0,0.4)', margin: '2px 0 0' }}>
                  Toca y dinos a dónde
                </p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2.5"
                strokeLinecap="round" width="18" height="18">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            {/* Quick actions */}
            <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[
                { e: '🛵', l: 'Mandado', d: 'Lleva lo que sea' },
                { e: '🛒', l: 'Súper', d: 'Tu despensa' },
                { e: '🍔', l: 'Comida', d: 'Restaurantes' },
              ].map(({ e, l, d }) => (
                <button key={l} className="btn-tap" onClick={() => setShowPrompt(true)} style={{
                  background: '#faf5f0', border: '1px solid rgba(232,93,4,0.12)',
                  borderRadius: 14, padding: '12px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  cursor: 'pointer', transition: 'all .15s',
                  boxShadow: '0 2px 8px rgba(107,26,26,0.06)',
                }}>
                  <span style={{ fontSize: 22 }}>{e}</span>
                  <span style={{ fontSize: 12, color: '#3d1000', fontWeight: 700 }}>{l}</span>
                  <span style={{ fontSize: 9, color: 'rgba(61,16,0,0.4)' }}>{d}</span>
                </button>
              ))}
            </div>

            {/* Bottom nav */}
            <div className="fade-up-5" style={{
              display: 'flex', justifyContent: 'space-around',
              paddingTop: 12, borderTop: '1px solid rgba(232,93,4,0.08)',
            }}>
              {[
                { label: 'Inicio', active: true, svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                { label: 'Pedidos', active: false, svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                { label: 'Historial', active: false, svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                { label: 'Cuenta', active: false, svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
              ].map(({ label, active, svg }) => (
                <button key={label} onClick={() => !active && setShowPrompt(true)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  color: active ? '#e85d04' : 'rgba(61,16,0,0.3)',
                  padding: '4px 10px', transition: 'color .15s',
                }}>
                  {svg}
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
                  {active && <div style={{ width: 4, height: 4, borderRadius: 2, background: '#e85d04' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOGIN */}
      {showPrompt && (
        <div onClick={() => setShowPrompt(false)} style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(61,16,0,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'flex-end', animation: 'fadeIn .2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: 'white',
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: '20px 20px 44px',
            boxShadow: '0 -12px 60px rgba(107,26,26,0.2)',
            animation: 'slideUp .35s cubic-bezier(.32,.72,0,1)',
          }}>
            <div style={{ width: 40, height: 4, background: '#e8d0c0',
              borderRadius: 99, margin: '0 auto 22px' }} />
            <img src={ICON} alt=""
              style={{ width: 60, height: 60, borderRadius: 16, objectFit: 'cover',
                display: 'block', margin: '0 auto 14px',
                boxShadow: '0 6px 24px rgba(232,93,4,0.3)' }} />
            <h3 style={{ textAlign: 'center', fontSize: 22, fontWeight: 900,
              color: '#3d1000', margin: '0 0 6px' }}>¡Casi listo!</h3>
            <p style={{ textAlign: 'center', fontSize: 13,
              color: 'rgba(61,16,0,0.5)', margin: '0 0 24px', lineHeight: 1.5 }}>
              Crea tu cuenta gratis para pedir<br/>tu primer mandado con Bib-Bib
            </p>
            <a href="/registro" className="btn-tap" style={{
              display: 'block', padding: '15px',
              background: 'linear-gradient(135deg,#e85d04,#f4a100)',
              borderRadius: 16, textAlign: 'center', color: 'white',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              boxSizing: 'border-box', boxShadow: '0 6px 24px rgba(232,93,4,0.4)',
              marginBottom: 12,
            }}>
              Crear cuenta gratis →
            </a>
            <a href="/login" className="btn-tap" style={{
              display: 'block', textAlign: 'center', padding: '12px',
              color: '#c94e03', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              border: '1.5px solid rgba(232,93,4,0.2)', borderRadius: 14,
              boxSizing: 'border-box',
            }}>
              Ya tengo cuenta — Entrar
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
