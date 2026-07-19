'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Tv, Sparkles, TrendingUp, Users, ArrowRight, Loader2 } from 'lucide-react';

export default function AdvertisePage() {
  const [partner, setPartner] = useState({ name: '', company: '', email: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setPartner({ name: '', company: '', email: '' });
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#ffffff', borderRadius: '24px', padding: '4rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 40px rgba(225,29,72,0.1)', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.5rem 1.2rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800, width: 'fit-content' }}>
            <Tv size={16} /> BRAND ADVERTISING PORTAL
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1 }}>Partner With Zyroz. Feature Your Brand Designs.</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', maxWidth: '650px', lineHeight: 1.6 }}>
            Promote your streetwear brand directly inside our interactive 3D studio. Let creators design custom hoodies, t-shirts, and apparel using your official brand logos and graphics.
          </p>
        </div>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '5rem', textAlign: 'center' }}>
          {[
            { icon: Users, val: '50,000+', label: 'Active 3D Designers' },
            { icon: TrendingUp, val: '100,000+', label: 'Apparel Mockups Saved' },
            { icon: Sparkles, val: '15.4%', label: 'Average CTR on Brand Assets' },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(225,29,72,0.06)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComponent size={20} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#000000' }}>{item.val}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</p>
              </div>
            );
          })}
        </div>

        {/* Partner Form */}
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '20px', padding: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>Get in Touch</h3>
          <p style={{ color: '#666666', fontSize: '0.95rem', marginBottom: '2rem', textAlign: 'center' }}>Partner with us to feature your design assets inside the studio.</p>

          <form onSubmit={handlePartnerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.4rem' }}>Your Name</label>
              <input required type="text" placeholder="John Doe" value={partner.name} onChange={e => setPartner({...partner, name: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.4rem' }}>Company / Brand</label>
              <input required type="text" placeholder="e.g. Acme Clothing" value={partner.company} onChange={e => setPartner({...partner, company: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.4rem' }}>Business Email</label>
              <input required type="email" placeholder="john@company.com" value={partner.email} onChange={e => setPartner({...partner, email: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>

            {success && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
                ✓ Application submitted! Our partnership team will contact you.
              </div>
            )}

            <button type="submit" disabled={sending} style={{ width: '100%', padding: '1rem', background: '#000000', color: '#ffffff', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              {sending ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <><Sparkles size={18} /> Apply for Partnership <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
