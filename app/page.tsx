'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;

    (window as any).initMap = () => {
      if (!mapRef.current) return;
      const mapStyles = [
        { elementType: 'geometry', stylers: [{ color: '#1a0800' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#f4a100' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d1000' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e85d04' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d0500' }] },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#f4a100' }] },
      ];
      const mapOpts = {
        center: { lat: 21.1619, lng: -86.8515 },
        zoom: 14,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
      };
      const map = new (window as any).google.maps.Map(mapRef.current, mapOpts);
      setReady(true);

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
              strokeColor: '#fff', strokeWeight: 2,
            },
          });
        });
      }
    };

    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const s = {
    btn: (active: boolean) => ({
      background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex' as const, flexDirection: 'column' as const,
      alignItems: 'center' as const, gap: 3,
      color: active ? '#e85d04' : 'rgba(255,220,180,0.4)',
      fontSize: 10, fontWeight: active ? 700 : 500, padding: '4px 8px',
    }),
  };

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}}`}</style>

      {/* MAPA */}
      <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#0f0500' }} />

      {/* SPLASH */}
      {!ready && (
        <div style={{ position: 'absolute', inset: 0, background: '#0f0500',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 20, zIndex: 5 }}>
          <img src="/icon-192.png" alt="Bib-Bib"
            style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover',
              boxShadow: '0 0 40px rgba(232,93,4,0.5)' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: '#e85d04',
                animation: `pulse 1.2s ${i*0.2}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0,
        paddingTop: 'env(safe-area-inset-top, 12px)', zIndex: 10 }}>
        <div style={{ margin: '8px 12px 0', background: 'rgba(15,5,0,0.9)',
          backdropFilter: 'blur(20px)', borderRadius: 14, padding: '8px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: '1px solid rgba(232,93,4,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/icon-192.png" alt=""
              style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 900, color: '#fff8f0', margin: 0, lineHeight: 1 }}>Bib-Bib</p>
              <p style={{ fontSize: 10, color: 'rgba(255,220,180,0.5)', margin: 0 }}>Servicio a domicilio</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/login" style={{ border: '1px solid rgba(232,93,4,0.3)',
              borderRadius: 10, padding: '6px 12px', color: 'rgba(255,220,180,0.7)',
              fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>Entrar</a>
            <a href="/registro" style={{ background: 'linear-gradient(135deg,#e85d04,#f4a100)',
              borderRadius: 10, padding: '6px 12px', color: 'white',
              fontSize: 12, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(232,93,4,0.4)' }}>Registrarme</a>
          </div>
        </div>
      </div>

      {/* BOTTOM SHEET */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div style={{ background: 'rgba(15,5,0,0.95)', backdropFilter: 'blur(24px)',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          border: '1px solid rgba(232,93,4,0.15)', padding: '12px 16px 16px' }}>
          <div style={{ width: 36, height: 4, background: 'rgba(232,93,4,0.3)',
            borderRadius: 2, margin: '0 auto 14px' }} />
          <button onClick={() => setShowPrompt(true)} style={{
            width: '100%', background: 'rgba(255,248,240,0.07)',
            border: '1.5px solid rgba(232,93,4,0.25)', borderRadius: 14,
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg,#e85d04,#f4a100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                strokeLinecap="round" width="18" height="18">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff8f0', margin: 0 }}>
                ¿A dónde va tu mandado?
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,220,180,0.4)', margin: '2px 0 0' }}>
                Toca para pedir
              </p>
            </div>
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
            {[{e:'🛵',l:'Mandado'},{e:'🛒',l:'Súper'},{e:'🍔',l:'Comida'}].map(({e,l}) => (
              <button key={l} onClick={() => setShowPrompt(true)} style={{
                background: 'rgba(255,248,240,0.04)',
                border: '1px solid rgba(232,93,4,0.15)', borderRadius: 12,
                padding: '10px 8px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <span style={{ fontSize: 20 }}>{e}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,220,180,0.6)', fontWeight: 600 }}>{l}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12,
            paddingTop: 12, borderTop: '1px solid rgba(232,93,4,0.1)' }}>
            {['Inicio','Pedidos','Historial','Mi cuenta'].map((l, i) => (
              <button key={l} onClick={() => setShowPrompt(true)} style={s.btn(i===0)}>
                <div style={{ width: 4, height: 4, borderRadius: 2,
                  background: i===0 ? '#e85d04' : 'transparent', marginBottom: 2 }} />
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showPrompt && (
        <div onClick={() => setShowPrompt(false)} style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: '#1a0800',
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: '20px 20px 40px',
            border: '1px solid rgba(232,93,4,0.2)' }}>
            <div style={{ width: 36, height: 4, background: 'rgba(232,93,4,0.3)',
              borderRadius: 2, margin: '0 auto 18px' }} />
            <img src="/icon-192.png" alt=""
              style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover',
                display: 'block', margin: '0 auto 12px' }} />
            <h3 style={{ textAlign: 'center', fontSize: 20, fontWeight: 900,
              color: '#fff8f0', margin: '0 0 6px' }}>¡Casi listo!</h3>
            <p style={{ textAlign: 'center', fontSize: 13,
              color: 'rgba(255,220,180,0.5)', margin: '0 0 22px' }}>
              Crea tu cuenta gratis para pedir tu primer mandado
            </p>
            <a href="/registro" style={{ display: 'block', padding: '14px',
              background: 'linear-gradient(135deg,#e85d04,#f4a100)',
              borderRadius: 14, textAlign: 'center', color: 'white',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(232,93,4,0.4)' }}>
              Crear cuenta gratis
            </a>
            <a href="/login" style={{ display: 'block', textAlign: 'center',
              marginTop: 12, color: 'rgba(255,220,180,0.5)',
              fontSize: 13, textDecoration: 'none' }}>
              Ya tengo cuenta — Entrar
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
