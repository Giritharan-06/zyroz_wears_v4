'use client';
import { useState, useEffect } from 'react';
import { Star, Trash2, Search, Filter, Loader2, MessageSquare, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: number;
  product_id: number;
  product_name: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  const filtered = reviews.filter(r => {
    const matchSearch = r.customer_name.toLowerCase().includes(search.toLowerCase()) || 
                        r.product_name.toLowerCase().includes(search.toLowerCase()) ||
                        r.comment.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === 'All' || r.rating.toString() === filterRating;
    return matchSearch && matchRating;
  });

  return (
    <div>
      <style>{`
        .review-row:hover { background: rgba(255,255,255,0.02); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Feedback</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Product Reviews</h1>
        </div>
        <button onClick={fetchReviews} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '1px solid #222', color: '#888', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
          <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#555" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', color: '#fff', width: '280px', outline: 'none' }} 
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#0f0f0f', border: '1px solid #1a1a1a', padding: '0 1rem', borderRadius: '8px' }}>
          <Filter size={14} color="#555" />
          <select 
            value={filterRating}
            onChange={e => setFilterRating(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#888', padding: '0.75rem 0', outline: 'none', cursor: 'pointer' }}
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#555' }}>
            <Loader2 size={40} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <p>Loading reviews...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#555' }}>
            <MessageSquare size={48} style={{ opacity: 0.1, margin: '0 auto 1rem' }} />
            <p>No reviews found matching your criteria.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #1a1a1a' }}>
                <th style={{ padding: '1rem', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '1rem', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Rating</th>
                <th style={{ padding: '1rem', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Review</th>
                <th style={{ padding: '1rem', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Product</th>
                <th style={{ padding: '1rem', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(review => (
                <tr key={review.id} className="review-row" style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ fontWeight: 600 }}>{review.customer_name}</div>
                    <div style={{ color: '#555', fontSize: '0.8rem' }}>{new Date(review.created_at).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', color: '#fde047', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "#fde047" : "none"} />)}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', maxWidth: '300px' }}>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.4 }}>{review.comment}</p>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 500 }}>{review.product_name}</span>
                      <Link href={`/product/${review.product_id}`} target="_blank" style={{ color: '#555', transition: 'color 0.2s' }}>
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid #f8717133', color: '#f87171', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {deletingId === review.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
