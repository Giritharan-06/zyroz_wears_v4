'use client';
import Navbar from '@/components/Navbar';
import { Award, Check, Sparkles, Shield, Gift, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ClubPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Elite Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderRadius: '24px', padding: '4rem 3rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: '4rem' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', padding: '0.5rem 1.2rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 800, width: 'fit-content' }}>
            <Award size={16} /> ZYROZ ELITE CLUB MEMBERSHIP
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1 }}>Unlock Premium Perks & Exclusive Customization Options</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Join the inner circle of streetwear creators. Get access to free shipping, buy 2 get 1 free custom orders, and limited edition designer templates.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link href="/customize" style={{ padding: '1.1rem 2rem', background: '#f59e0b', color: '#000000', fontWeight: 800, borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Start Customizing
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem', textAlign: 'center' }}>Elite Membership Benefits</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {[
            { icon: Sparkles, title: 'Buy 2 Get 1 Free', desc: 'Add 3 custom 3D customizer items to your cart, and the cheapest one is automatically free.' },
            { icon: Shield, title: 'Early Access drops', desc: 'Get access to new collections and premium baked mesh fabrics 24 hours before public release.' },
            { icon: Gift, title: 'Premium Free Gifts', desc: 'Receive exclusive accessories, keychains, and pins with every customized order.' },
            { icon: Zap, title: 'Priority Fulfillment', desc: 'Elite members bypass the standard design queue, shipping within 48 hours.' },
          ].map((b, idx) => {
            const IconComp = b.icon;
            return (
              <div key={idx} style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <IconComp size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{b.title}</h3>
                <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem' }}>{b.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Terms/FAQ */}
        <div style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>How do I qualify for Zyroz Elite Club?</h4>
              <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>Simply place your first customized 3D order! Membership is free and automatically activated once you join the streetwear creators community.</p>
            </div>
            <div style={{ height: '1px', backgroundColor: '#eaeaea' }} />
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Does Buy 2 Get 1 Apply to non-custom items?</h4>
              <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>Yes! The club deal discount is applied automatically at the checkout screen on any combination of custom or collection items in your cart.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
