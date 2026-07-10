'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Package, Truck, CheckCircle, Clock, ChevronRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/format';

interface StatusConfig {
  icon: React.ElementType;
  color: string;
  bg: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  'Processing': { icon: Clock, color: '#fde047', bg: 'rgba(253,224,71,0.1)' },
  'Shipped':    { icon: Truck, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
  'Delivered':  { icon: CheckCircle, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
};

interface Order {
  id: number;
  status: string;
  created_at: string;
  total_amount: number;
  customer_name: string;
  tracking_number?: string;
  items_count?: number;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/user/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchOrders();
  }, [user, authLoading, fetchOrders, router]);

  if (authLoading || (loading && user)) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '12vh', paddingBottom: '10vh', maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Your Orders</h1>
            <p style={{ color: '#555', marginTop: '0.5rem' }}>Track and manage your recent purchases</p>
          </div>
          <div style={{ position: 'relative' }}>
             <Search size={18} color="#444" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
             <input type="text" placeholder="Search orders..." style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.6rem 1rem 0.6rem 2.5rem', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
          </div>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#0a0a0a', borderRadius: '24px', border: '1px solid #1a1a1a' }}>
            <Package size={64} color="#222" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>No orders yet</h2>
            <p style={{ color: '#555', marginTop: '0.5rem', marginBottom: '2rem' }}>When you buy something, it will appear here.</p>
            <Link href="/" style={{ background: '#fff', color: '#000', padding: '0.8rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order, i) => {
              const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['Processing'];
              const Icon = config.icon as any;
              return (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '20px', overflow: 'hidden' }}
                >
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Order Placed</p>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Total</p>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatPrice(order.total_amount)}</p>
                      </div>
                      <div className="mobile-hide">
                        <p style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Ship To</p>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.customer_name}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Order # {order.id}</p>
                      <Link href={`/orders/${order.id}`} style={{ color: '#4ade80', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>View Details</Link>
                    </div>
                  </div>
                  
                  <div className="mobile-flex-col" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '50px', height: '50px', background: config.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={24} color={config.color} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: config.color }}>{order.status}</h3>
                        <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                          {order.status === 'Shipped' ? `Tracking: ${order.tracking_number}` : 'Your order is being prepared'}
                        </p>
                      </div>
                    </div>
                    <Link href={`/orders/${order.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', color: '#fff', border: '1px solid #222', padding: '0.7rem 1.2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s', width: '100%', justifyContent: 'center', maxWidth: '200px' }}>
                      Track Order <ChevronRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
