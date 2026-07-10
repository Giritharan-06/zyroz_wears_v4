'use client';
import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Loader2, RefreshCw, X, Calendar, Percent, IndianRupee } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_purchase: '',
    expiry_date: '',
    usage_limit: '',
    is_active: true
  });

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/discounts');
      const data = await res.json();
      setDiscounts(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ code: '', type: 'percentage', value: '', min_purchase: '', expiry_date: '', usage_limit: '', is_active: true });
        fetchDiscounts();
      }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await fetch('/api/admin/discounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });
      setDiscounts(prev => prev.map(d => d.id === id ? { ...d, is_active: !currentStatus } : d));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    try {
      await fetch(`/api/admin/discounts?id=${id}`, { method: 'DELETE' });
      fetchDiscounts();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <style>{`
        .btn-primary { background: #4ade80; color: #000; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3); }
        .btn-icon { background: #111; border: 1px solid #222; color: #888; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .btn-icon:hover { background: #222; color: #fff; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #0a0a0a; border: 1px solid #222; padding: 2.5rem; border-radius: 20px; width: 500px; max-width: 95vw; }
        .form-input { width: 100%; padding: 0.8rem; background: #111; border: 1px solid #333; color: #fff; border-radius: 8px; outline: none; margin-top: 0.5rem; }
        .form-input:focus { border-color: #4ade80; }
        .discount-card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 16px; padding: 1.5rem; transition: border-color 0.2s; }
        .discount-card:hover { border-color: #333; }
        .badge { padding: 4px 10px; borderRadius: 99px; fontSize: 0.75rem; fontWeight: 700; textTransform: uppercase; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p style={{ color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Marketing & Growth</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Discounts</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchDiscounts} className="btn-icon"><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
          <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={20} /> Create Code</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#555' }}>
          <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
          <p>Loading discount campaigns...</p>
        </div>
      ) : discounts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: '#0a0a0a', borderRadius: '24px', border: '1px solid #1a1a1a' }}>
          <Tag size={64} color="#222" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>No active discounts</h2>
          <p style={{ color: '#555', marginTop: '0.5rem', marginBottom: '2rem' }}>Create your first promo code to boost your sales.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ margin: '0 auto' }}>Get Started</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {discounts.map((d) => (
            <div key={d.id} className="discount-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#111', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={20} color="#4ade80" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.05em' }}>{d.code}</h3>
                    <p style={{ color: '#555', fontSize: '0.8rem' }}>Created {new Date(d.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div 
                  onClick={() => toggleStatus(d.id, d.is_active)}
                  style={{ 
                    padding: '4px 12px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, 
                    background: d.is_active ? 'rgba(74,222,128,0.1)' : '#1a1a1a', 
                    color: d.is_active ? '#4ade80' : '#555', cursor: 'pointer',
                    border: `1px solid ${d.is_active ? 'rgba(74,222,128,0.2)' : '#222'}`
                  }}
                >
                  {d.is_active ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#050505', padding: '1rem', borderRadius: '12px', border: '1px solid #111' }}>
                  <p style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Value</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    {d.type === 'percentage' ? `${parseFloat(d.value)}%` : formatPrice(d.value)}
                  </p>
                </div>
                <div style={{ background: '#050505', padding: '1rem', borderRadius: '12px', border: '1px solid #111' }}>
                  <p style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Used</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    {d.usage_count} <span style={{ color: '#333', fontWeight: 400, fontSize: '0.9rem' }}>/ {d.usage_limit || '∞'}</span>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #111', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
                  <IndianRupee size={14} /> Min. Purchase: {formatPrice(d.min_purchase)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
                  <Calendar size={14} /> Expires: {d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : 'Never'}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button onClick={() => handleDelete(d.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Trash2 size={14} /> Delete Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>New Promo Campaign</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ color: '#888', fontSize: '0.85rem' }}>Discount Code</label>
                <input 
                  required 
                  className="form-input" 
                  style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}
                  placeholder="e.g. SUMMER50" 
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '0.85rem' }}>Type</label>
                  <select className="form-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '0.85rem' }}>Value</label>
                  <input required type="number" className="form-input" placeholder={formData.type === 'percentage' ? '10' : '500'} value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ color: '#888', fontSize: '0.85rem' }}>Min. Purchase (₹)</label>
                  <input type="number" className="form-input" placeholder="0" value={formData.min_purchase} onChange={e => setFormData({ ...formData, min_purchase: e.target.value })} />
                </div>
                <div>
                  <label style={{ color: '#888', fontSize: '0.85rem' }}>Usage Limit</label>
                  <input type="number" className="form-input" placeholder="No limit" value={formData.usage_limit} onChange={e => setFormData({ ...formData, usage_limit: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ color: '#888', fontSize: '0.85rem' }}>Expiry Date</label>
                <input type="date" className="form-input" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} />
              </div>

              <button disabled={submitting} type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem' }}>
                {submitting ? <Loader2 size={20} className="animate-spin" /> : 'Launch Campaign'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
