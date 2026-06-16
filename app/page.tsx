'use client';

import { useEffect, useRef, useState } from 'react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const HERO = '/hero.png';
const ICON = '/icon-192.png';

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!splashDone || !mapRef.current) return;

    // CSS de Mapbox
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
    document.head.appendChild(link);

    // JS de Mapbox
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => {
      const mapboxgl = (window as any).mapboxgl;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-86.8515, 21.1619],
        zoom: 13,
        attributionControl: false,
      });

      map.on('load', () => {
        setMapLoaded(true);
        // Geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            map.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 15, duration: 1200 });
            new mapboxgl.Marker({ color: '#e85d04' })
              .setLngLat([pos.coords.longitude, pos.coords.latitude])
              .addTo(map);
          });
        }
      });
    };
    document.head.appendChild(script);
  }, [splashDone]);

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden', background: '#f5f5f5' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.85)}50%{opacity:1;transform:scale(1)}}
        @keyframes ripple{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.6);opacity:0}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        .fu1{animation:fadeUp .45s .1s both}
        .fu2{animation:fadeUp .45s .2s both}
        .fu3{animation:fadeUp .45s .35s both}
        .fu4{animation:fadeUp .45s .5s both}
        .fu5{animation:fadeUp .45s .65s both}
        .su{animation:slideUp .4s cubic-bezier(.32,.72,0,1) both}
        button:active,a:active{transform:scale(.96)}
        .mapboxgl-ctrl-logo,.mapboxgl-ctrl-attrib{display:none!important}
      `}</style>

      {/* SPLASH */}
      <div style={{
        position:'absolute',inset:0,zIndex:50,background:'#fff8f0',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:24,
        transition:'opacity .5s ease, transform .5s ease',
        opacity:splashDone?0:1, transform:splashDone?'scale(1.04)':'scale(1)',
        pointerEvents:splashDone?'none':'auto',
      }}>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
          {[0,1].map(i=>(
            <div key={i} style={{
              position:'absolute',width:96,height:96,borderRadius:'50%',
              border:'2px solid rgba(232,93,4,0.25)',
              animation:`ripple 2s ${i*1}s ease-out infinite`,
            }}/>
          ))}
          <img src={ICON} alt="Bib-Bib" style={{
            width:96,height:96,borderRadius:24,objectFit:'cover',
            boxShadow:'0 12px 40px rgba(232,93,4,0.3)',position:'relative',zIndex:1,
          }}/>
        </div>
        <div style={{textAlign:'center'}}>
          <p style={{fontSize:28,fontWeight:900,color:'#3d1000',margin:'0 0 4px',letterSpacing:-.5}}>Bib-Bib</p>
          <p style={{fontSize:12,color:'rgba(61,16,0,0.4)',margin:0,letterSpacing:1.5}}>SERVICIO A DOMICILIO</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{width:8,height:8,borderRadius:4,background:'#e85d04',
              animation:`pulse 1.4s ${i*.2}s ease-in-out infinite`}}/>
          ))}
        </div>
      </div>

      {/* MAPA MAPBOX */}
      <div ref={mapRef} style={{
        width:'100%',height:'100%',background:'#f0ece8',
        opacity:mapLoaded?1:0,transition:'opacity .8s ease',
      }}/>

      {/* Loading mapa */}
      {splashDone && !mapLoaded && (
        <div style={{position:'absolute',inset:0,background:'#f0ece8',
          display:'flex',alignItems:'center',justifyContent:'center',zIndex:5}}>
          <div style={{width:36,height:36,border:'3px solid rgba(232,93,4,0.15)',
            borderTop:'3px solid #e85d04',borderRadius:'50%',animation:'pulse .8s linear infinite'}}/>
        </div>
      )}

      {/* HEADER */}
      {splashDone && (
        <div className="fu1" style={{position:'absolute',top:0,left:0,right:0,
          paddingTop:'env(safe-area-inset-top,12px)',zIndex:20}}>
          <div style={{
            margin:'8px 12px 0',
            background:'rgba(255,255,255,0.94)',backdropFilter:'blur(20px)',
            borderRadius:16,padding:'10px 14px',
            display:'flex',alignItems:'center',justifyContent:'space-between',
            boxShadow:'0 4px 20px rgba(107,26,26,0.1)',
            border:'1px solid rgba(232,93,4,0.1)',
          }}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <img src={ICON} alt="" style={{width:34,height:34,borderRadius:9,objectFit:'cover'}}/>
              <div>
                <p style={{fontSize:14,fontWeight:900,color:'#3d1000',margin:0,lineHeight:1}}>Bib-Bib</p>
                <p style={{fontSize:10,color:'rgba(61,16,0,0.4)',margin:0}}>Cancún · En línea 🟢</p>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <a href="/login" style={{
                border:'1.5px solid rgba(232,93,4,0.3)',borderRadius:10,
                padding:'6px 14px',color:'#c94e03',fontSize:12,fontWeight:700,
                textDecoration:'none',background:'rgba(232,93,4,0.04)',
              }}>Entrar</a>
              <a href="/registro" style={{
                background:'linear-gradient(135deg,#e85d04,#f4a100)',
                borderRadius:10,padding:'6px 14px',color:'white',
                fontSize:12,fontWeight:700,textDecoration:'none',
                boxShadow:'0 3px 14px rgba(232,93,4,0.35)',
              }}>Registrarme</a>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET */}
      {splashDone && (
        <div className="su" style={{position:'absolute',bottom:0,left:0,right:0,zIndex:20,
          paddingBottom:'env(safe-area-inset-bottom,0px)'}}>
          <div style={{
            background:'rgba(255,255,255,0.97)',backdropFilter:'blur(30px)',
            borderTopLeftRadius:28,borderTopRightRadius:28,
            padding:'14px 16px 20px',
            boxShadow:'0 -8px 40px rgba(107,26,26,0.1)',
            border:'1px solid rgba(232,93,4,0.06)',
          }}>
            <div style={{width:40,height:4,background:'rgba(232,93,4,0.18)',
              borderRadius:99,margin:'0 auto 16px'}}/>

            {/* Hero banner */}
            <div className="fu2" style={{borderRadius:16,overflow:'hidden',marginBottom:14,height:110,position:'relative'}}>
              <img src={HERO} alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(.82)'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(107,26,26,0.72) 0%,transparent 55%)'}}/>
              <div style={{position:'absolute',bottom:12,left:14}}>
                <p style={{fontSize:16,fontWeight:900,color:'white',margin:0,textShadow:'0 1px 8px rgba(0,0,0,0.3)'}}>Tu mandado en minutos</p>
                <p style={{fontSize:11,color:'rgba(255,255,255,0.7)',margin:'3px 0 0'}}>Cancún y zona hotelera</p>
              </div>
              <div style={{position:'absolute',top:10,right:10,
                background:'rgba(0,0,0,0.4)',backdropFilter:'blur(8px)',
                borderRadius:20,padding:'4px 10px',display:'flex',alignItems:'center',gap:5}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:'#22c55e',
                  boxShadow:'0 0 6px #22c55e'}}/>
                <span style={{fontSize:10,fontWeight:700,color:'white'}}>Activo</span>
              </div>
            </div>

            {/* Búsqueda */}
            <button className="fu3" onClick={() => setShowPrompt(true)} style={{
              width:'100%',background:'#faf5f0',
              border:'1.5px solid rgba(232,93,4,0.18)',borderRadius:16,
              padding:'13px 16px',display:'flex',alignItems:'center',gap:12,
              cursor:'pointer',textAlign:'left',marginBottom:12,
              boxShadow:'0 2px 12px rgba(232,93,4,0.07)',
            }}>
              <div style={{width:40,height:40,borderRadius:12,flexShrink:0,
                background:'linear-gradient(135deg,#e85d04,#f4a100)',
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 4px 12px rgba(232,93,4,0.3)'}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" width="20" height="20">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:15,fontWeight:700,color:'#3d1000',margin:0}}>¿A dónde va tu mandado?</p>
                <p style={{fontSize:11,color:'rgba(61,16,0,0.38)',margin:'2px 0 0'}}>Toca y dinos a dónde</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2.5"
                strokeLinecap="round" width="18" height="18">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            {/* Quick actions */}
            <div className="fu4" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
              {[
                {e:'🛵',l:'Mandado',d:'Lleva lo que sea'},
                {e:'🛒',l:'Súper',d:'Tu despensa'},
                {e:'🍔',l:'Comida',d:'Restaurantes'},
              ].map(({e,l,d}) => (
                <button key={l} onClick={() => setShowPrompt(true)} style={{
                  background:'#faf5f0',border:'1px solid rgba(232,93,4,0.1)',
                  borderRadius:14,padding:'12px 8px',
                  display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                  cursor:'pointer',boxShadow:'0 2px 8px rgba(107,26,26,0.05)',
                }}>
                  <span style={{fontSize:22}}>{e}</span>
                  <span style={{fontSize:12,color:'#3d1000',fontWeight:700}}>{l}</span>
                  <span style={{fontSize:9,color:'rgba(61,16,0,0.38)'}}>{d}</span>
                </button>
              ))}
            </div>

            {/* Bottom nav */}
            <div className="fu5" style={{display:'flex',justifyContent:'space-around',
              paddingTop:12,borderTop:'1px solid rgba(232,93,4,0.07)'}}>
              {[
                {label:'Inicio',active:true,svg:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
                {label:'Pedidos',active:false,svg:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>},
                {label:'Historial',active:false,svg:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>},
                {label:'Cuenta',active:false,svg:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
              ].map(({label,active,svg}) => (
                <button key={label} onClick={() => !active && setShowPrompt(true)} style={{
                  background:'none',border:'none',cursor:'pointer',
                  display:'flex',flexDirection:'column',alignItems:'center',gap:3,
                  color:active?'#e85d04':'rgba(61,16,0,0.28)',padding:'4px 10px',
                }}>
                  {svg}
                  <span style={{fontSize:10,fontWeight:active?700:500}}>{label}</span>
                  {active && <div style={{width:4,height:4,borderRadius:2,background:'#e85d04'}}/>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showPrompt && (
        <div onClick={() => setShowPrompt(false)} style={{
          position:'fixed',inset:0,zIndex:50,
          background:'rgba(61,16,0,0.45)',backdropFilter:'blur(8px)',
          display:'flex',alignItems:'flex-end',animation:'fadeIn .2s ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width:'100%',background:'white',
            borderTopLeftRadius:28,borderTopRightRadius:28,
            padding:'20px 20px 44px',
            boxShadow:'0 -12px 60px rgba(107,26,26,0.18)',
            animation:'slideUp .35s cubic-bezier(.32,.72,0,1)',
          }}>
            <div style={{width:40,height:4,background:'#e8d0c0',borderRadius:99,margin:'0 auto 22px'}}/>
            <img src={ICON} alt="" style={{
              width:60,height:60,borderRadius:16,objectFit:'cover',
              display:'block',margin:'0 auto 14px',
              boxShadow:'0 6px 24px rgba(232,93,4,0.28)',
            }}/>
            <h3 style={{textAlign:'center',fontSize:22,fontWeight:900,color:'#3d1000',margin:'0 0 6px'}}>
              ¡Casi listo!
            </h3>
            <p style={{textAlign:'center',fontSize:13,color:'rgba(61,16,0,0.48)',margin:'0 0 24px',lineHeight:1.5}}>
              Crea tu cuenta gratis para pedir<br/>tu primer mandado con Bib-Bib
            </p>
            <a href="/registro" style={{
              display:'block',padding:'15px',
              background:'linear-gradient(135deg,#e85d04,#f4a100)',
              borderRadius:16,textAlign:'center',color:'white',
              fontSize:15,fontWeight:700,textDecoration:'none',
              boxSizing:'border-box',boxShadow:'0 6px 24px rgba(232,93,4,0.38)',
              marginBottom:12,
            }}>Crear cuenta gratis →</a>
            <a href="/login" style={{
              display:'block',textAlign:'center',padding:'12px',
              color:'#c94e03',fontSize:13,fontWeight:600,textDecoration:'none',
              border:'1.5px solid rgba(232,93,4,0.18)',borderRadius:14,boxSizing:'border-box',
            }}>Ya tengo cuenta — Entrar</a>
          </div>
        </div>
      )}
    </div>
  );
}
