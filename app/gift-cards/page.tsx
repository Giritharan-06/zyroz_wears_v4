'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { CreditCard, Check, ShieldCheck, Loader2 } from 'lucide-react';

export default function GiftCardsPage() {
  const [balance, setBalance] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [card, setCard] = useState({ number: '', pin: '' });

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setTimeout(() => {
      setBalance('250.00');
      setChecking(false);
    }, 1500);
  };

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <CreditCard size={32} color="#e11d48" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Gift Cards</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }} className="mobile-stack">
          {/* Card Mockup */}
          <div style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', color: '#ffffff', padding: '2rem', borderRadius: '16px', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 15px 30px rgba(225,29,72,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.05em' }}>ZYROZ GIFT CARD</span>
              <ShieldCheck size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '0.25rem' }}>CARD HOLDER</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em' }}>VALUED CUSTOMER</h3>
            </div>
          </div>

          {/* Form Balance Check */}
          <form onSubmit={handleCheckBalance} style={{ background: '#ffffff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Check Card Balance</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.4rem' }}>Gift Card Number</label>
              <input required type="text" placeholder="16-digit Card Number" value={card.number} onChange={e => setCard({...card, number: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.4rem' }}>Security PIN</label>
              <input required type="password" placeholder="6-digit PIN" value={card.pin} onChange={e => setCard({...card, pin: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>

            {balance !== null && (
              <div style={{ background: '#e11d4808', border: '1px solid #e11d481a', color: '#e11d48', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, textAlign: 'center' }}>
                Card Balance: ${balance}
              </div>
            )}

            <button type="submit" disabled={checking} style={{ width: '100%', padding: '1rem', background: '#000000', color: '#ffffff', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: checking ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {checking ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Check Balance'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
