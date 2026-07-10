'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Loader2, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/lib/format';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'collection',
    sub_category: '',
    price: '',
    stock: '',
    image_url: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      });

      if (res.ok) {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({ name: '', category: 'collection', sub_category: '', price: '', stock: '', image_url: '' });
        fetchProducts();
      } else {
        alert('Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error saving product');
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      sub_category: product.sub_category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url
    });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: 'collection', sub_category: '', price: '', stock: '', image_url: '' });
    setShowModal(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .btn-primary { background: #4ade80; color: #000; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3); }
        .btn-icon { background: #222; border: 1px solid #333; color: #fff; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .btn-icon:hover { background: #333; border-color: #555; transform: scale(1.1); }
        .btn-delete:hover { border-color: #ef4444; color: #ef4444; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #0a0a0a; border: 1px solid #222; padding: 3rem; border-radius: 20px; width: 500px; max-width: 95vw; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; color: #888; font-size: 0.9rem; }
        .form-input { width: 100%; padding: 0.8rem; background: #111; border: 1px solid #333; color: #fff; border-radius: 8px; outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: #4ade80; }
        table { width: 100%; border-collapse: collapse; margin-top: 2rem; }
        th { text-align: left; padding: 1rem; border-bottom: 1px solid #222; color: #888; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 1rem; border-bottom: 1px solid #111; vertical-align: middle; }
        tr:hover { background: rgba(255,255,255,0.02); }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Inventory</h1>
          <p style={{ color: '#666' }}>Manage your products and collections</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchProducts} className="btn-icon" title="Refresh"><RefreshCw size={20} className={loading ? 'animate-spin' : ''}/></button>
          <button onClick={openAdd} className="btn-primary"><Plus size={20}/> Add Product</button>
        </div>
      </div>

      <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: '#666' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={40}/>
            <p>Loading inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: '#666' }}>
             <p>No products found in database.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#222', flexShrink: 0 }}>
                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>{p.category} / {p.sub_category}</span>
                  </td>
                  <td>
                    <span style={{ color: p.stock < 10 ? '#ef4444' : '#fff' }}>{p.stock} units</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#4ade80' }}>{formatPrice(p.price)}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(p)} className="btn-icon"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="btn-icon btn-delete"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Classic Luxury Hoodie" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                 <div className="form-group">
                   <label>Category</label>
                   <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                     <option value="collection">Collection</option>
                     <option value="chain">Chain</option>
                   </select>
                 </div>
                 <div className="form-group">
                   <label>Sub-Category</label>
                   <input required className="form-input" value={formData.sub_category} onChange={e => setFormData({...formData, sub_category: e.target.value})} placeholder="e.g. men, gold, silver" />
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Price (INR)</label>
                  <input required type="number" step="0.01" className="form-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="45.00" />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input required type="number" className="form-input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="100" />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input required className="form-input" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '1.2rem' }}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
