'use client';
import { useState, useEffect } from 'react';
import {
  Store, Users, TrendingUp, Package, Star, Search, RefreshCw,
  CheckCircle, XCircle, Clock, ChevronDown, Eye, Loader2,
  DollarSign, AlertTriangle, ShieldCheck, Percent, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

interface Vendor {
  id: number;
  store_name: string;
  owner_name: string;
  email: string;
  phone: string;
  category: string;
  status: 'active' | 'pending' | 'suspended';
  commission_rate: number;
  total_sales: number;
  total_revenue: number;
  rating: number;
  created_at: string;
}

const STATUS_CONFIG = {
  active:    { icon: CheckCircle, color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   label: 'Active' },
  pending:   { icon: Clock,        color: '#fde047', bg: 'rgba(253,224,71,0.1)',   label: 'Pending' },
  suspended: { icon: XCircle,      color: '#f87171', bg: 'rgba(248,113,113,0.1)', label: 'Suspended' },
};

export default function VendorsAdminPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [initLoading, setInitLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const initDB = async () => {
    setInitLoading(true);
    try {
      await fetch('/api/admin/vendors', { method: 'POST' });
      await fetchVendors();
    } catch (e) { console.error(e); }
    finally { setInitLoading(false); }
  };

  useEffect(() => { fetchVendors(); }, []);

  const updateVendor = async (id: number, payload: Partial<Vendor>) => {
    setUpdatingId(id);
    try {
      await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload }),
      });
      setVendors(prev => prev.map(v => v.id === id ? { ...v, ...payload } : v));
      if (selectedVendor?.id === id) setSelectedVendor(prev => prev ? { ...prev, ...payload } : prev);
    } catch (e) { alert('Update failed'); }
    finally { setUpdatingId(null); }
  };

  const filtered = vendors.filter(v => {
    const matchSearch = v.store_name.toLowerCase().includes(search.toLowerCase()) ||
                        v.owner_name.toLowerCase().includes(search.toLowerCase()) ||
                        v.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || v.status === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalRevenue = vendors.reduce((s, v) => s + Number(v.total_revenue), 0);
  const totalSales = vendors.reduce((s, v) => s + Number(v.total_sales), 0);
  const activeCount = vendors.filter(v => v.status === 'active').length;
  const pendingCount = vendors.filter(v => v.status === 'pending').length;

  return (
    <div>
      <style>{`
        .vendor-tr:hover td { background: rgba(255,255,255,0.02); }
        .vendor-th { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; color: #555; border-bottom: 1px solid #1a1a1a; }
        .vendor-td { padding: 1rem; border-bottom: 1px solid #111; vertical-align: middle; font-size: 0.9rem; }
        .chip { padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
        .filter-chip { padding: 0.4rem 1rem; border-radius: 99px; border: 1px solid #222; background: transparent; color: #888; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .filter-chip.active { background: #fff; color: #000; border-color: #fff; }
        .filter-chip:hover:not(.active) { border-color: #444; color: #ccc; }
        .vendor-card { background: #0f0f0f; padding: 1.5rem; border-radius: 12px; border: 1px solid #1a1a1a; transition: all 0.2s; cursor: pointer; }
        .vendor-card:hover { border-color: #333; }
        .drawer { position: fixed; right: 0; top: 0; height: 100vh; width: 420px; background: #0a0a0a; border-left: 1px solid #1a1a1a; z-index: 200; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 199; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Marketplace</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Vendor Management</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={initDB} disabled={initLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '1px solid #333', color: '#888', padding: '0.65rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            {initLoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={15} />}
            Init DB Tables
          </button>
          <button onClick={fetchVendors} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '1px solid #222', color: '#888', padding: '0.65rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Vendors', value: vendors.length, icon: Store, color: '#a78bfa', bg: '#1a0d2e' },
          { label: 'Active Vendors', value: activeCount, icon: CheckCircle, color: '#4ade80', bg: '#0d1f0d' },
          { label: 'Pending Approval', value: pendingCount, icon: Clock, color: '#fde047', bg: '#1f1b0d', alert: pendingCount > 0 },
          { label: 'Marketplace Sales', value: totalSales, icon: Package, color: '#60a5fa', bg: '#0d1726' },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#4ade80', bg: '#0d1f0d' },
        ].map(card => (
          <div key={card.label} style={{ background: '#0f0f0f', padding: '1.25rem', borderRadius: '12px', border: `1px solid ${card.alert ? '#fde04733' : '#1a1a1a'}` }}>
            <div style={{ width: '40px', height: '40px', background: card.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <card.icon size={18} color={card.color} />
            </div>
            <p style={{ color: '#555', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{card.label}</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: card.alert ? '#fde047' : '#fff' }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', marginRight: '0.5rem' }}>
          <Search size={15} color="#555" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: '#111', border: '1px solid #222', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', color: '#fff', width: '220px', fontSize: '0.88rem', outline: 'none' }} />
        </div>
        {['All', 'Active', 'Pending', 'Suspended'].map(s => (
          <button key={s} className={`filter-chip${filterStatus === s ? ' active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      {/* Vendors Table */}
      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
            <Loader2 size={36} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <p>Loading vendors...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
            <Store size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No vendors found. Click "Init DB Tables" to seed sample data.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="vendor-th">Vendor / Store</th>
                <th className="vendor-th">Category</th>
                <th className="vendor-th">Status</th>
                <th className="vendor-th">Commission</th>
                <th className="vendor-th">Sales</th>
                <th className="vendor-th">Revenue</th>
                <th className="vendor-th">Rating</th>
                <th className="vendor-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(vendor => {
                const sc = STATUS_CONFIG[vendor.status] || STATUS_CONFIG.pending;
                const StatusIcon = sc.icon;
                return (
                  <tr key={vendor.id} className="vendor-tr">
                    <td className="vendor-td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', background: '#1a1a1a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#4ade80', fontSize: '1.1rem', flexShrink: 0 }}>
                          {vendor.store_name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{vendor.store_name}</div>
                          <div style={{ color: '#555', fontSize: '0.8rem' }}>{vendor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="vendor-td" style={{ color: '#888' }}>{vendor.category}</td>
                    <td className="vendor-td">
                      <span className="chip" style={{ background: sc.bg, color: sc.color }}>
                        <StatusIcon size={12} /> {sc.label}
                      </span>
                    </td>
                    <td className="vendor-td">
                      <span style={{ color: '#a78bfa', fontWeight: 600 }}>{vendor.commission_rate}%</span>
                    </td>
                    <td className="vendor-td" style={{ fontWeight: 600 }}>{Number(vendor.total_sales).toLocaleString()}</td>
                    <td className="vendor-td" style={{ fontWeight: 600, color: '#4ade80' }}>${Number(vendor.total_revenue).toLocaleString()}</td>
                    <td className="vendor-td">
                      {Number(vendor.rating) > 0 ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fde047' }}>
                          <Star size={14} fill="#fde047" /> {Number(vendor.rating).toFixed(1)}
                        </span>
                      ) : <span style={{ color: '#444' }}>—</span>}
                    </td>
                    <td className="vendor-td">
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setSelectedVendor(vendor)} style={{ padding: '0.4rem 0.8rem', background: '#1a1a1a', border: '1px solid #333', color: '#ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={13} /> View
                        </button>
                        <Link href="/vendor/dashboard" style={{ padding: '0.4rem 0.8rem', background: '#4ade80', border: '1px solid #4ade8033', color: '#000', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>
                          <LayoutDashboard size={13} /> Dashboard
                        </Link>
                        {vendor.status === 'pending' && (
                          <button onClick={() => updateVendor(vendor.id, { status: 'active' })} disabled={updatingId === vendor.id} style={{ padding: '0.4rem 0.8rem', background: 'rgba(74,222,128,0.1)', border: '1px solid #4ade8033', color: '#4ade80', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                            Approve
                          </button>
                        )}
                        {vendor.status === 'active' && (
                          <button onClick={() => updateVendor(vendor.id, { status: 'suspended' })} disabled={updatingId === vendor.id} style={{ padding: '0.4rem 0.8rem', background: 'rgba(248,113,113,0.1)', border: '1px solid #f8717133', color: '#f87171', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                            Suspend
                          </button>
                        )}
                        {vendor.status === 'suspended' && (
                          <button onClick={() => updateVendor(vendor.id, { status: 'active' })} disabled={updatingId === vendor.id} style={{ padding: '0.4rem 0.8rem', background: 'rgba(74,222,128,0.1)', border: '1px solid #4ade8033', color: '#4ade80', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                            Reinstate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Vendor Detail Drawer */}
      {selectedVendor && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedVendor(null)} />
          <div className="drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedVendor.store_name}</h2>
              <button onClick={() => setSelectedVendor(null)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#888', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Close</button>
            </div>

            {/* Status Badge */}
            {(() => {
              const sc = STATUS_CONFIG[selectedVendor.status];
              const Icon = sc.icon;
              return (
                <span className="chip" style={{ background: sc.bg, color: sc.color, fontSize: '0.85rem', padding: '6px 14px' }}>
                  <Icon size={14} /> {sc.label}
                </span>
              );
            })()}

            {/* Vendor Info */}
            <div style={{ background: '#111', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: '0.3rem' }}>Vendor Details</h3>
              {[
                { label: 'Owner', value: selectedVendor.owner_name },
                { label: 'Email', value: selectedVendor.email },
                { label: 'Phone', value: selectedVendor.phone || '—' },
                { label: 'Category', value: selectedVendor.category },
                { label: 'Joined', value: new Date(selectedVendor.created_at).toLocaleDateString() },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#555', fontSize: '0.88rem' }}>{r.label}</span>
                  <span style={{ fontWeight: 500, fontSize: '0.88rem' }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Revenue Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Total Sales', value: Number(selectedVendor.total_sales).toLocaleString(), color: '#60a5fa' },
                { label: 'Revenue', value: `$${Number(selectedVendor.total_revenue).toLocaleString()}`, color: '#4ade80' },
                { label: 'Rating', value: Number(selectedVendor.rating) > 0 ? `${Number(selectedVendor.rating).toFixed(1)} ★` : 'No ratings', color: '#fde047' },
                { label: 'Commission', value: `${selectedVendor.commission_rate}%`, color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} style={{ background: '#111', padding: '1rem', borderRadius: '8px' }}>
                  <p style={{ color: '#555', fontSize: '0.75rem', marginBottom: '0.3rem' }}>{s.label}</p>
                  <p style={{ fontWeight: 700, fontSize: '1.2rem', color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Edit Commission */}
            <div style={{ background: '#111', borderRadius: '10px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: '1rem' }}>Commission Rate</h3>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Percent size={16} color="#a78bfa" />
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  defaultValue={selectedVendor.commission_rate}
                  onBlur={e => updateVendor(selectedVendor.id, { commission_rate: parseFloat(e.target.value) })}
                  style={{ flex: 1, padding: '0.75rem 1rem', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', outline: 'none' }}
                />
                <span style={{ color: '#555', fontSize: '0.85rem' }}>%</span>
              </div>
              <p style={{ color: '#444', fontSize: '0.78rem', marginTop: '0.5rem' }}>Commission is deducted from each sale. Changes save on blur.</p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555' }}>Actions</h3>
              <Link href="/vendor/dashboard" style={{ padding: '0.85rem', background: '#4ade80', color: '#000', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <LayoutDashboard size={18} /> Open Vendor Dashboard
              </Link>
              {selectedVendor.status !== 'active' && (
                <button onClick={() => updateVendor(selectedVendor.id, { status: 'active' })} style={{ padding: '0.85rem', background: 'rgba(74,222,128,0.1)', border: '1px solid #4ade8044', color: '#4ade80', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  ✓ Approve & Activate Vendor
                </button>
              )}
              {selectedVendor.status === 'active' && (
                <button onClick={() => updateVendor(selectedVendor.id, { status: 'suspended' })} style={{ padding: '0.85rem', background: 'rgba(248,113,113,0.1)', border: '1px solid #f8717144', color: '#f87171', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  ⊘ Suspend Vendor
                </button>
              )}
              <button style={{ padding: '0.85rem', background: '#1a1a1a', border: '1px solid #333', color: '#ccc', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                ✉ Send Email to Vendor
              </button>
              <button style={{ padding: '0.85rem', background: '#1a1a1a', border: '1px solid #333', color: '#ccc', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                📦 View Vendor Products
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
