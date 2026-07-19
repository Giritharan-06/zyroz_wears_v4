'use client';
import { useState, useEffect, useCallback, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Truck, CheckCircle, MapPin, ChevronLeft, Loader2, Box, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const STATUS_STEPS = ['Processing', 'Shipped', 'Delivered'] as const;

interface Order {
  id: number;
  status: typeof STATUS_STEPS[number];
  created_at: string;
  total_amount: number;
  customer_name: string;
  shipping_address?: string;
  tracking_number?: string;
  items_count?: number;
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/user/orders/${id}`);
      const data = await res.json();
      if (res.ok) setOrder(data as Order);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchOrder();
  }, [user, authLoading, fetchOrder, router]);

  if (authLoading || (loading && user)) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} color="#000" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!order) {
    return (
      <main style={{ minHeight: '100vh', background: '#ffffff', color: '#000000' }}>
        <Navbar />
        <div className="container" style={{ paddingTop: '15vh', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order not found</h1>
          <Link href="/orders" style={{ color: '#e11d48', marginTop: '1rem', display: 'inline-block', fontWeight: 700 }}>Back to My Orders</Link>
        </div>
      </main>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', color: '#000000' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '15vh', paddingBottom: '10vh', maxWidth: '900px' }}>
        
        <Link href="/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Back to Orders
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#000', letterSpacing: '-0.02em' }}>Order Tracking</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>Order # {order.id} • {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          {order.tracking_number && (
            <div style={{ background: '#f9fafb', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              <p style={{ color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 600 }}>Tracking Number</p>
              <p style={{ color: '#e11d48', fontWeight: 800, fontSize: '1.1rem' }}>{order.tracking_number}</p>
            </div>
          )}
        </div>

        {/* Tracking Visualization */}
        <div style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '24px', padding: '3rem 2rem', marginBottom: '3rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div className="tracking-container">
            {STATUS_STEPS.map((step, idx) => {
              const isActive = idx <= currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={step} className="tracking-step">
                  <div className="step-icon-container">
                    <div className={`step-line ${idx === 0 ? 'first' : ''} ${isActive ? 'active' : ''}`} />
                    <div style={{ 
                      width: '40px', height: '40px', background: isActive ? '#10b981' : '#f3f4f6', 
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 2, border: `4px solid #fff`, boxShadow: isActive ? '0 0 15px rgba(16,185,129,0.25)' : 'none',
                      transition: 'all 0.3s'
                    }}>
                      {idx === 0 && <Box size={18} color={isActive ? '#fff' : '#666'} />}
                      {idx === 1 && <Truck size={18} color={isActive ? '#fff' : '#666'} />}
                      {idx === 2 && <CheckCircle size={18} color={isActive ? '#fff' : '#666'} />}
                    </div>
                  </div>
                  <div className="step-text">
                    <p style={{ fontWeight: 700, color: isActive ? '#000' : '#888', fontSize: '0.95rem' }}>{step}</p>
                    {isCurrent && <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.2rem', fontWeight: 700 }}>Current Stage</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          .tracking-container { display: flex; justify-content: space-between; position: relative; }
          .tracking-step { display: flex; flexDirection: column; alignItems: center; gap: 1rem; flex: 1; position: relative; }
          .step-icon-container { position: relative; width: 100%; display: flex; justify-content: center; }
          .step-line { position: absolute; top: 20px; left: -50%; width: 100%; height: 2px; background: #eaeaea; z-index: 1; }
          .step-line.active { background: #10b981; }
          .step-line.first { display: none; }
          .step-text { text-align: center; }

          @media (max-width: 768px) {
            .tracking-container { flex-direction: column; gap: 2rem; }
            .tracking-step { flex-direction: row; align-items: flex-start; text-align: left; }
            .step-icon-container { width: 40px; flex-shrink: 0; }
            .step-line { left: 19px; top: 40px; width: 2px; height: 100%; }
            .step-text { text-align: left; padding-top: 8px; }
          }
        `}</style>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Shipping Info */}
          <div style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#000' }}>
              <MapPin size={20} color="#10b981" /> Shipping Address
            </h3>
            <p style={{ color: '#000', fontWeight: 700, marginBottom: '0.5rem' }}>{order.customer_name}</p>
            <p style={{ color: '#666', lineHeight: 1.6 }}>{order.shipping_address || '123 Fashion Street, Suite 404\nNew Delhi, India 110001'}</p>
          </div>

          {/* Payment Info */}
          <div style={{ background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#000' }}>
              <CreditCard size={20} color="#10b981" /> Payment Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <span>Subtotal ({order.items_count} items)</span>
                <span>${(Number(order.total_amount) - 10).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', color: '#000', fontWeight: 800, fontSize: '1.2rem' }}>
                <span>Total</span>
                <span>${Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
