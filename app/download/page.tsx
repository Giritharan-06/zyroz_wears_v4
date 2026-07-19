'use client';
import Navbar from '@/components/Navbar';
import { Download, Sparkles, Smartphone, Check } from 'lucide-react';

export default function DownloadPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <Download size={32} color="#e11d48" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Download App</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="mobile-stack">
          {/* App Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(225,29,72,0.06)', color: '#e11d48', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700, width: 'fit-content' }}>
              <Sparkles size={14} /> NOW AVAILABLE ON MOBILE
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2 }}>Design on the Go. Create Streetwear Anywhere.</h2>
            <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Get the official ZYROZ Studio app on your iOS or Android device. Upload custom graphics directly from your phone camera roll and preview them in real-time augmented reality (AR)!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                'Instant phone camera roll upload support',
                'Augmented Reality (AR) Wear Preview',
                'Exclusive app-only club coupons',
                'Real-time push notifications on order tracking',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', color: '#4b5563', fontWeight: 500 }}>
                  <Check size={16} color="#10b981" /> <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Buttons Mockup */}
          <div style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Select Platform</h3>
              <p style={{ color: '#666666', fontSize: '0.85rem' }}>Compatible with iOS 15.0+ and Android 9.0+</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '280px' }}>
              <button style={{ padding: '1rem', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Download on App Store
              </button>
              <button style={{ padding: '1rem', background: '#000000', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Download on Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
