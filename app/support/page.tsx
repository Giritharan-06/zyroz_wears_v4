'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Headphones, Mail, Phone, Clock, MessageSquare, Loader2 } from 'lucide-react';

export default function SupportPage() {
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setTicket({ subject: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const FAQS = [
    { q: 'How long does custom printing take?', a: 'Standard production takes 2–3 days. Elite members qualify for priority 24–48 hour fulfillment.' },
    { q: 'Can I edit my order details after purchase?', a: 'You can change shipping or customization details within 6 hours of purchase by contacting our 24x7 helpline.' },
    { q: 'What is your refund policy on custom designs?', a: 'Since custom apparels are tailored to order, we only accept returns in the case of printing defects or size mismatches.' },
  ];

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <Headphones size={32} color="#e11d48" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Customer Care</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '5rem' }} className="mobile-stack">
          {/* Contact Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Direct Contact</h3>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(225,29,72,0.06)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Call Support</h4>
                <p style={{ color: '#666666', fontSize: '0.9rem', marginTop: '0.2rem' }}>+91 1800 234 5678 (Toll Free)</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(225,29,72,0.06)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Email Support</h4>
                <p style={{ color: '#666666', fontSize: '0.9rem', marginTop: '0.2rem' }}>care@zyroz.com</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(225,29,72,0.06)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Availability</h4>
                <p style={{ color: '#666666', fontSize: '0.9rem', marginTop: '0.2rem' }}>24 Hours a Day, 7 Days a Week</p>
              </div>
            </div>
          </div>

          {/* Support Ticket Form */}
          <form onSubmit={handleSupportSubmit} style={{ background: '#ffffff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} /> Submit a Ticket
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.4rem' }}>Subject</label>
              <input required type="text" placeholder="e.g. Order Delivery Status" value={ticket.subject} onChange={e => setTicket({...ticket, subject: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.4rem' }}>Describe your issue</label>
              <textarea required rows={4} placeholder="Please provide order number if applicable..." value={ticket.message} onChange={e => setTicket({...ticket, message: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid #ddd', borderRadius: '8px', outline: 'none', resize: 'vertical' }} />
            </div>

            {success && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
                ✓ Ticket submitted successfully! We'll reply within 1 hour.
              </div>
            )}

            <button type="submit" disabled={sending} style={{ width: '100%', padding: '1rem', background: '#000000', color: '#ffffff', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {sending ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Send Message'}
            </button>
          </form>
        </div>

        {/* FAQs */}
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {FAQS.map((faq, idx) => (
            <div key={idx} style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '12px', padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{faq.q}</h4>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
