'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, ShoppingBag, Users, Palette, ArrowUpRight, Package, Loader2, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Stats {
  orders: { total: number; delivered: number; processing: number; shipped: number; cancelled: number };
  revenue: number;
  products: { total: number; total_stock: number };
  designs: { total: number };
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  created_at: string;
  items_count: number;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Processing: { bg: 'rgba(234,179,8,0.15)', text: '#fde047' },
  Shipped:    { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  Delivered:  { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  Cancelled:  { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/orders').then(r => r.json()),
      ]);
      setStats(statsRes);
      setOrders(ordersRes.slice(0, 6));
    } catch (e) {
      console.error('Dashboard fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const formatCurrency = (n: number) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const timeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div>
      <style>{`
        .metric-card { background: #0f0f0f; padding: 1.5rem; border-radius: 12px; border: 1px solid #1a1a1a; transition: all 0.25s; }
        .metric-card:hover { border-color: #333; transform: translateY(-2px); }
        .stat-ring { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .orders-table th { padding: 0.75rem 1rem; text-align: left; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #555; border-bottom: 1px solid #1a1a1a; }
        .orders-table td { padding: 1rem; border-bottom: 1px solid #111; vertical-align: middle; font-size: 0.9rem; }
        .orders-table tr:hover td { background: rgba(255,255,255,0.02); }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Welcome back</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Dashboard</h1>
        </div>
        <button onClick={fetchAll} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '1px solid #222', color: '#888', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
          <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
        </button>
      </div>

      {loading && !stats ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#555' }}>
          <Loader2 size={40} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p>Loading live data...</p>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div className="stat-ring" style={{ background: '#0d1f0d' }}><TrendingUp size={20} color="#4ade80" /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80', background: '#4ade8015', padding: '2px 8px', borderRadius: '4px' }}>+12.5%</span>
              </div>
              <p style={{ color: '#555', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Total Revenue</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatCurrency(stats?.revenue || 0)}</p>
            </div>

            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div className="stat-ring" style={{ background: '#0d1726' }}><ShoppingBag size={20} color="#60a5fa" /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', background: '#60a5fa15', padding: '2px 8px', borderRadius: '4px' }}>+5.2%</span>
              </div>
              <p style={{ color: '#555', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Total Orders</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{Number(stats?.orders?.total || 0).toLocaleString()}</p>
            </div>

            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div className="stat-ring" style={{ background: '#1a0d2e' }}><Package size={20} color="#a78bfa" /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', background: '#a78bfa15', padding: '2px 8px', borderRadius: '4px' }}>Live Sync</span>
              </div>
              <p style={{ color: '#555', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Products</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{Number(stats?.products?.total || 0)}</p>
            </div>

            <div className="metric-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div className="stat-ring" style={{ background: '#1f1b0d' }}><Palette size={20} color="#fde047" /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fde047', background: '#fde04715', padding: '2px 8px', borderRadius: '4px' }}>+2.4%</span>
              </div>
              <p style={{ color: '#555', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Custom Designs</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{Number(stats?.designs?.total || 0)}</p>
            </div>
          </div>

          {/* Order Status Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { label: 'Processing', val: stats?.orders?.processing || 0, icon: <Clock size={16} color="#fde047" />, color: '#fde047' },
              { label: 'Shipped', val: stats?.orders?.shipped || 0, icon: <ShoppingBag size={16} color="#60a5fa" />, color: '#60a5fa' },
              { label: 'Delivered', val: stats?.orders?.delivered || 0, icon: <CheckCircle size={16} color="#4ade80" />, color: '#4ade80' },
              { label: 'Cancelled', val: stats?.orders?.cancelled || 0, icon: <XCircle size={16} color="#f87171" />, color: '#f87171' },
            ].map(item => (
              <div key={item.label} style={{ background: '#0f0f0f', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {item.icon}
                <div>
                  <p style={{ color: '#555', fontSize: '0.75rem' }}>{item.label}</p>
                  <p style={{ fontWeight: 700, color: item.color, fontSize: '1.1rem' }}>{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.5rem 1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Orders</h2>
              <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4ade80', fontSize: '0.85rem', textDecoration: 'none' }}>
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const sc = STATUS_COLORS[order.status] || { bg: '#222', text: '#aaa' };
                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600, color: '#4ade80', fontFamily: 'monospace' }}>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.customer_name}</div>
                        <div style={{ color: '#555', fontSize: '0.8rem' }}>{order.customer_email}</div>
                      </td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 600, background: sc.bg, color: sc.text }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(order.total_amount)}</td>
                      <td style={{ textAlign: 'right', color: '#555', fontSize: '0.85rem' }}>{timeAgo(order.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '2.5rem' }}>
            {[
              { href: '/admin/products', label: 'Manage Products', color: '#a78bfa' },
              { href: '/admin/designs', label: 'Review Designs', color: '#fde047' },
              { href: '/admin/support', label: 'Open Tickets', color: '#f87171' },
              { href: '/admin/logistics', label: 'Track Shipments', color: '#60a5fa' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', background: '#0f0f0f', border: '1px solid #1a1a1a',
                borderRadius: '10px', textDecoration: 'none', color: '#ccc',
                fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s'
              }}>
                {link.label}
                <ArrowUpRight size={16} color={link.color} />
              </Link>
            ))}
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
