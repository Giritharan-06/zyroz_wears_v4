'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, User as UserIcon } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user);
        router.push('/');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (e) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '420px', background: '#ffffff', border: '1px solid #eaeaea', borderRadius: '24px', padding: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem' }}>Z</span>
            </div>
            <span style={{ color: '#000', fontSize: '1.5rem', fontWeight: 800 }}>ZYROZ</span>
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#000' }}>Create an account</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Join the Zyroz community today</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: '#666', fontSize: '0.85rem', fontWeight: 500, marginLeft: '4px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                required
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                style={{ width: '100%', background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '1rem 1rem 1rem 3rem', color: '#000', fontSize: '1rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: '#666', fontSize: '0.85rem', fontWeight: 500, marginLeft: '4px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                required
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{ width: '100%', background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '1rem 1rem 1rem 3rem', color: '#000', fontSize: '1rem', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: '#666', fontSize: '0.85rem', fontWeight: 500, marginLeft: '4px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                required
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', background: '#fff', border: '1px solid #ddd', borderRadius: '12px', padding: '1rem 1rem 1rem 3rem', color: '#000', fontSize: '1rem', outline: 'none' }}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            style={{ 
              marginTop: '1rem', padding: '1.1rem', background: '#000', color: '#fff', border: 'none', borderRadius: '12px', 
              fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
            }}
          >
            {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666', fontSize: '0.95rem' }}>
          Already have an account? <Link href="/login" style={{ color: '#000', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
        </p>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
