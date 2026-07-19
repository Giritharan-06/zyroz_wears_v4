'use client';
import Navbar from '@/components/Navbar';
import { Gift, Award, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RewardsPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <Gift size={32} color="#e11d48" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Rewards</h1>
        </div>

        {/* Balance Card */}
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', padding: '2.5rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 15px 30px rgba(16,185,129,0.15)', marginBottom: '3rem' }} className="mobile-stack">
          <div>
            <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '0.5rem', fontWeight: 700 }}>AVAILABLE POINTS</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>750 PTS</h2>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.8rem 1.5rem', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 700 }}>
            Gold Tier Member
          </div>
        </div>

        {/* Rewards Ledger */}
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Points Ledger</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
          {[
            { title: 'Custom 3D Editor Purchase', pts: '+250 PTS', date: 'July 10, 2026', type: 'earn' },
            { title: 'New Onboarding Signup Bonus', pts: '+500 PTS', date: 'July 08, 2026', type: 'earn' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', border: '1px solid #eaeaea', borderRadius: '12px', background: '#f9fafb' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{item.title}</h4>
                <p style={{ color: '#666666', fontSize: '0.8rem', marginTop: '0.2rem' }}>{item.date}</p>
              </div>
              <div style={{ color: item.type === 'earn' ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '1.1rem' }}>
                {item.pts}
              </div>
            </div>
          ))}
        </div>

        {/* Claim Rewards */}
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Available Coupons to Unlock</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {[
            { code: 'ZYROZ100', desc: 'Get ₹500 Off any customized apparel', cost: '500 Points', unlocked: true },
            { code: 'ZYROZFREE', desc: 'Unlock FREE express global delivery', cost: '1000 Points', unlocked: false },
          ].map((coupon, idx) => (
            <div key={idx} style={{ background: '#ffffff', border: `1px solid ${coupon.unlocked ? '#10b981' : '#eaeaea'}`, borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: coupon.unlocked ? '#10b981' : '#888' }}>{coupon.code}</span>
                {coupon.unlocked && <CheckCircle2 size={20} color="#10b981" />}
              </div>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.5 }}>{coupon.desc}</p>
              <button 
                disabled={!coupon.unlocked}
                style={{ 
                  width: '100%', padding: '0.8rem', 
                  background: coupon.unlocked ? '#000000' : '#eaeaea', 
                  color: coupon.unlocked ? '#ffffff' : '#888888', 
                  border: 'none', borderRadius: '8px', 
                  fontWeight: 700, fontSize: '0.85rem', 
                  cursor: coupon.unlocked ? 'pointer' : 'not-allowed', 
                  marginTop: '0.5rem' 
                }}
              >
                {coupon.unlocked ? 'Copy Code' : `Needs ${coupon.cost}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
