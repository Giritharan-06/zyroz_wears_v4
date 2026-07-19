'use client';
import { useState } from 'react';
import { Store, CheckCircle, ArrowRight, Package, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const BENEFITS = [
  { icon: TrendingUp, title: 'Reach Thousands', desc: 'Sell to Zyroz\'s existing customer base from day one. No marketing spend needed to start.' },
  { icon: Shield, title: 'Seller Protection', desc: 'Every transaction is protected. Our platform handles payments, disputes, and chargebacks.' },
  { icon: Zap, title: 'Instant Setup', desc: 'Get your store live in minutes. Upload products, set prices, and start selling immediately.' },
  { icon: Package, title: 'Logistics Support', desc: 'We connect you with trusted shipping partners. Focus on products — we handle the rest.' },
];

const CATEGORIES = ['Streetwear', 'T-Shirts', 'Shirts', 'Pants', 'Jewelry / Chains', 'Accessories', 'Hoodies', 'Sneakers', 'Other'];

export default function VendorRegisterPage() {
  const [step, setStep] = useState<'landing' | 'form' | 'success'>('landing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    store_name: '', owner_name: '', email: '', phone: '',
    category: '', description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/vendor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed. Please try again.'); return; }
      setStep('success');
    } catch (e) { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', 
    padding: '0.9rem 1rem', 
    background: '#ffffff',
    border: '1px solid #ddd', 
    color: '#000000', 
    borderRadius: '8px',
    fontSize: '0.95rem', 
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000' }}>
      <Navbar />

      {step === 'landing' && (
        <>
          {/* Hero */}
          <section style={{ padding: '20vh 5vw 10vh', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', color: '#059669', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
              <Zap size={14} /> Now accepting new vendor applications
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.03em', color: '#000000' }}>
              Sell on Zyroz.<br />
              <span style={{ color: '#10b981' }}>Reach millions.</span>
            </h1>
            <p style={{ color: '#4b5563', fontSize: '1.2rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 3rem' }}>
              Join India's fastest growing streetwear marketplace. List your products, manage orders, and grow your brand — all from one powerful dashboard.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setStep('form')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.2rem 2.5rem', background: '#000000', color: '#ffffff', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'background-color 0.2s' }}>
                Apply to Sell <ArrowRight size={18} />
              </button>
              <Link href="/vendor/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.2rem 2.5rem', background: 'transparent', color: '#000000', fontWeight: 600, borderRadius: '8px', border: '1px solid #ddd', textDecoration: 'none', fontSize: '1rem', transition: 'background-color 0.2s' }}>
                Vendor Login
              </Link>
            </div>
          </section>

          {/* Stats */}
          <section style={{ borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea', background: '#f9fafb' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0' }}>
              {[
                { val: '5,000+', label: 'Monthly Customers' },
                { val: '₹0', label: 'Setup Fee' },
                { val: '8–15%', label: 'Low Commission' },
                { val: '24/7', label: 'Seller Support' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '3rem 2rem', borderRight: i < 3 ? '1px solid #eaeaea' : 'none' }}>
                  <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', marginBottom: '0.5rem' }}>{s.val}</p>
                  <p style={{ color: '#666666', fontSize: '0.9rem' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section style={{ padding: '8rem 5vw', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, textAlign: 'center', marginBottom: '4rem', letterSpacing: '-0.02em', color: '#000000' }}>
              Why Sell on Zyroz?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2rem' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(16,185,129,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <b.icon size={22} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'none', letterSpacing: 'normal', color: '#000000' }}>{b.title}</h3>
                  <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '0.95rem', fontWeight: 400 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it Works */}
          <section style={{ padding: '0 5vw 8rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, textAlign: 'center', marginBottom: '4rem', letterSpacing: '-0.02em', color: '#000000' }}>How it Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
              {[
                { step: '01', title: 'Apply Online', desc: 'Fill out our simple vendor application form. Takes less than 5 minutes.' },
                { step: '02', title: 'Get Approved', desc: 'Our team reviews your application within 24–48 hours.' },
                { step: '03', title: 'List Products', desc: 'Upload your catalog. Set your own prices and descriptions.' },
                { step: '04', title: 'Start Earning', desc: 'Orders flow directly to you. Payouts every Monday.' },
              ].map(s => (
                <div key={s.step} style={{ padding: '2rem 1.5rem', background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '16px' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(16,185,129,0.15)', marginBottom: '1rem' }}>{s.step}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', textTransform: 'none', letterSpacing: 'normal', color: '#000000' }}>{s.title}</h3>
                  <p style={{ color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.6, fontWeight: 400 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <section style={{ padding: '6rem 5vw', textAlign: 'center', background: '#f9fafb', borderTop: '1px solid #eaeaea' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#000000' }}>Ready to start selling?</h2>
            <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontSize: '1.1rem' }}>No upfront fees. No monthly subscription. Pay only when you sell.</p>
            <button onClick={() => setStep('form')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1.2rem 3rem', background: '#10b981', color: '#ffffff', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'background-color 0.2s' }}>
              Apply Now — It's Free <ArrowRight size={18} />
            </button>
          </section>
        </>
      )}

      {step === 'form' && (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '18vh 2rem 6rem' }}>
          <button onClick={() => setStep('landing')} style={{ background: 'none', border: 'none', color: '#666666', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            ← Back
          </button>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#000000' }}>Vendor Application</h1>
          <p style={{ color: '#4b5563', marginBottom: '3rem', fontSize: '1rem' }}>Tell us about your store. We'll review and get back to you within 48 hours.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#4b5563', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Store Name *</label>
                <input name="store_name" required value={form.store_name} onChange={handleChange} placeholder="Your Brand Name" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#4b5563', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Your Full Name *</label>
                <input name="owner_name" required value={form.owner_name} onChange={handleChange} placeholder="John Doe" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#4b5563', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Business Email *</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@yourbrand.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#4b5563', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#4b5563', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Primary Product Category *</label>
              <select name="category" required value={form.category} onChange={handleChange} style={inputStyle}>
                <option value="">Select a category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#4b5563', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Tell us about your brand</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe your products, your story, and what makes you unique..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', padding: '1rem', color: '#ef4444', fontSize: '0.9rem' }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ padding: '1.2rem', background: '#000000', color: '#ffffff', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {loading ? 'Submitting...' : <><Store size={18} /> Submit Application</>}
            </button>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '25vh 2rem', textAlign: 'center' }}>
          <div style={{ width: '90px', height: '90px', background: 'rgba(16,185,129,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <CheckCircle size={44} color="#10b981" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#000000' }}>Application Received!</h1>
          <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '3rem' }}>
            Thank you for applying to be a Zyroz vendor. Our team will review your application and reach out to <strong style={{ color: '#000000' }}>{form.email}</strong> within 24–48 hours.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ padding: '1rem 2rem', background: '#000000', color: '#ffffff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none' }}>
              Back to Shop
            </Link>
            <Link href="/vendor/dashboard" style={{ padding: '1rem 2rem', background: 'transparent', color: '#000000', fontWeight: 700, borderRadius: '8px', border: '1px solid #ddd', textDecoration: 'none' }}>
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
