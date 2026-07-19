'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Bell, Save } from 'lucide-react';

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState({
    orders: true,
    promotional: false,
    customizer: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <Bell size={32} color="#e11d48" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Notifications</h1>
        </div>

        <form onSubmit={handleSave} style={{ background: '#ffffff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Notification Preferences</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Orders Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#000000' }}>Order Updates</h4>
                <p style={{ color: '#666666', fontSize: '0.85rem', marginTop: '0.15rem' }}>Receive email notifications on shipping, deliveries, and billing.</p>
              </div>
              <input type="checkbox" checked={prefs.orders} onChange={e => setPrefs({...prefs, orders: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#e11d48' }} />
            </div>

            <div style={{ height: '1px', backgroundColor: '#eaeaea' }} />

            {/* Customizer Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#000000' }}>3D Studio Updates</h4>
                <p style={{ color: '#666666', fontSize: '0.85rem', marginTop: '0.15rem' }}>Get updates on saved custom models, templates, and designs.</p>
              </div>
              <input type="checkbox" checked={prefs.customizer} onChange={e => setPrefs({...prefs, customizer: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#e11d48' }} />
            </div>

            <div style={{ height: '1px', backgroundColor: '#eaeaea' }} />

            {/* Promo Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#000000' }}>Promotions & Coupons</h4>
                <p style={{ color: '#666666', fontSize: '0.85rem', marginTop: '0.15rem' }}>Get notified about weekly deals, seasonal offers, and coupon releases.</p>
              </div>
              <input type="checkbox" checked={prefs.promotional} onChange={e => setPrefs({...prefs, promotional: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#e11d48' }} />
            </div>
          </div>

          {saved && (
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
              ✓ Preferences saved successfully!
            </div>
          )}

          <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.1rem', background: '#000000', color: '#ffffff', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}>
            <Save size={18} /> Save Preferences
          </button>
        </form>
      </div>
    </main>
  );
}
