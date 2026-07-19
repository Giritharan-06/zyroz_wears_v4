'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Camera, Save, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Skyline Residency, Bandra West, Mumbai, Maharashtra 400050',
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>My Profile</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }} className="mobile-stack">
          {/* Left - Avatar Card */}
          <div style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <User size={64} color="#888888" />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '0.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                <Camera size={16} color="#fff" />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{profile.name}</h3>
              <p style={{ color: '#666666', fontSize: '0.85rem' }}>{profile.email}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#e11d4812', color: '#e11d48', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
              <Shield size={12} /> ZYROZ Member
            </div>
          </div>

          {/* Right - Profile Form */}
          <form onSubmit={handleSubmit} style={{ background: '#ffffff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#888" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input required type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#888" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input required type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#888" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>Shipping Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#888" style={{ position: 'absolute', left: '1rem', top: '1.1rem' }} />
                <textarea rows={3} value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }} />
              </div>
            </div>

            {saved && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
                ✓ Profile saved successfully!
              </div>
            )}

            <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.1rem', background: '#000000', color: '#ffffff', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
