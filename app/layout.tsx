import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bib-Bib — Servicio a Domicilio',
  description: 'Mandaditos rapidos a tu puerta',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#e85d04" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0f0500', fontFamily: 'Inter,system-ui,sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
