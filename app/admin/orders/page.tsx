'use client';
import { useState, useEffect } from 'react';
import { Eye, Download, RefreshCw, ChevronDown, Search, Loader2, Filter, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  created_at: string;
  items_count: number;
}

const ALL_STATUSES = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Processing: { bg: 'rgba(234,179,8,0.15)', text: '#fde047' },
  Shipped:    { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  Delivered:  { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  Cancelled:  { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (e) { alert('Update failed'); }
    finally { setUpdatingId(null); }
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
                        String(o.id).includes(search);
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const timeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div>
      <style>{`
        .orders-th { padding: 0.75rem 1.25rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; color: #555; border-bottom: 1px solid #1a1a1a; }
        .orders-td { padding: 1rem 1.25rem; border-bottom: 1px solid #111; vertical-align: middle; }
        .orders-tr:hover td { background: rgba(255,255,255,0.02); }
        .status-select { background: transparent; border: none; color: inherit; font-size: 0.78rem; font-weight: 600; outline: none; cursor: pointer; padding-right: 0; }
        .filter-chip { padding: 0.4rem 1rem; border-radius: 99px; border: 1px solid #222; background: transparent; color: #888; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .filter-chip.active { background: #fff; color: #000; border-color: #fff; }
        .filter-chip:hover:not(.active) { border-color: #444; color: #ccc; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Store Management</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Orders</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '1px solid #222', color: '#888', padding: '0.65rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#4ade80', color: '#000', padding: '0.65rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', marginRight: '0.5rem' }}>
          <Search size={15} color="#555" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: '#111', border: '1px solid #222', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', color: '#fff', width: '220px', fontSize: '0.88rem', outline: 'none' }}
          />
        </div>
        {ALL_STATUSES.map(s => (
          <button key={s} className={`filter-chip${filterStatus === s ? ' active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
            <Loader2 size={36} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <p>Loading orders from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
            <p>No orders match your filters.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="orders-th">Order ID</th>
                <th className="orders-th">Customer</th>
                <th className="orders-th">Items</th>
                <th className="orders-th">Status</th>
                <th className="orders-th">Amount</th>
                <th className="orders-th">Date</th>
                <th className="orders-th" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const sc = STATUS_COLORS[order.status] || { bg: '#222', text: '#aaa' };
                return (
                  <tr key={order.id} className="orders-tr">
                    <td className="orders-td" style={{ fontWeight: 600, fontFamily: 'monospace', color: '#4ade80' }}>#{order.id}</td>
                    <td className="orders-td">
                      <div style={{ fontWeight: 500 }}>{order.customer_name}</div>
                      <div style={{ color: '#555', fontSize: '0.8rem' }}>{order.customer_email}</div>
                    </td>
                    <td className="orders-td" style={{ color: '#888' }}>{order.items_count || '—'} items</td>
                    <td className="orders-td">
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '99px', background: sc.bg, color: sc.text, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                        <select className="status-select" value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)} style={{ color: sc.text }} disabled={updatingId === order.id}>
                          {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{s}</option>)}
                        </select>
                        <ChevronDown size={12} />
                      </div>
                    </td>
                    <td className="orders-td" style={{ fontWeight: 600 }}>{formatPrice(order.total_amount)}</td>
                    <td className="orders-td" style={{ color: '#555', fontSize: '0.85rem' }}>{timeAgo(order.created_at)}</td>
                    <td className="orders-td" style={{ textAlign: 'right' }}>
                      <Link 
                        href={`/orders/${order.id}`} 
                        target="_blank"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#888', background: '#1a1a1a', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s' }}
                      >
                        <ExternalLink size={14} /> Track
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
