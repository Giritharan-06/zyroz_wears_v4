'use client';

import { useState, useEffect } from 'react';
import {
  Package, TrendingUp, DollarSign, Plus, Eye, Edit, Trash2, Box, Store, LogOut, Bell, Settings,
  Menu, X, Search, Filter, CheckCircle, XCircle, Clock, ChevronDown, Download, Image as ImageIcon,
  CreditCard, Mail, Phone, MapPin, Percent, Star, AlertCircle, Loader2, PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Product {
  id: string | number;
  name: string;
  price: number;
  stock: number;
  category: string;
  sub_category?: string;
  image_url: string;
  status?: string;
  sales?: number;
}

interface Order {
  id: string | number;
  customer_name?: string;
  customer?: string;
  total: number;
  status: string;
  created_at?: string;
  date?: string;
  items?: number;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Processing: { bg: 'rgba(234,179,8,0.15)', text: '#fde047' },
  Shipped: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
  Delivered: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
  Cancelled: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
  Active: { bg: 'rgba(74,222,128,0.1)', text: '#4ade80' },
  'Out of Stock': { bg: 'rgba(248,113,113,0.1)', text: '#f87171' },
};

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form State for new product
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Streetwear',
    sub_category: 'T-Shirts',
    price: '',
    stock: '',
    image_url: ''
  });

  const [vendorData] = useState({
    storeName: 'UrbanThread Co.',
    ownerName: 'Rahul Sharma',
    email: 'rahul@urbanthread.com',
    phone: '+91 98765 43210',
    description: 'Premium urban streetwear from Chennai. Hoodies, tees, and more.',
    totalRevenue: 24800,
    totalSales: 342,
    activeProducts: 24,
    rating: 4.8,
    commissionRate: 12,
  });

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#0a0a0a',
    border: '1px solid #222',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/orders')
      ]);
      
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.map((p: any) => ({
          ...p,
          status: p.stock > 0 ? 'Active' : 'Out of Stock',
          sales: Math.floor(Math.random() * 50) // Mock sales for UI
        })));
      }
      
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock)
        })
      });
      
      if (res.ok) {
        setNotification({ type: 'success', message: 'Product added successfully!' });
        setShowAddModal(false);
        setNewProduct({ name: '', category: 'Streetwear', sub_category: 'T-Shirts', price: '', stock: '', image_url: '' });
        fetchData();
      } else {
        setNotification({ type: 'error', message: 'Failed to add product.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Error connecting to server.' });
    }
    
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotification({ type: 'success', message: 'Product deleted.' });
        fetchData();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete.' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .sidebar-link {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.25rem;
          border-radius: 8px; color: #888; transition: all 0.2s; text-decoration: none;
          font-size: 0.95rem; font-weight: 500; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left;
        }
        .sidebar-link:hover { background: #1a1a1a; color: #fff; }
        .sidebar-link.active { background: #1a1a1a; color: #fff; border-left: 3px solid #4ade80; border-radius: 0 8px 8px 0; }
        .stat-card { background: #0f0f0f; padding: 1.5rem; border-radius: 12px; border: 1px solid #1a1a1a; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-2px); border-color: #333; }
        .data-table th { padding: 1rem 1.25rem; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #666; border-bottom: 1px solid #1a1a1a; font-weight: 600; letter-spacing: 0.05em; }
        .data-table td { padding: 1rem 1.25rem; border-bottom: 1px solid #111; font-size: 0.95rem; vertical-align: middle; }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }
        .badge { padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; }
        .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.2rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; }
        .btn-primary { background: #4ade80; color: #000; }
        .btn-primary:hover { background: #22c55e; }
        .btn-secondary { background: #111; color: #fff; border: 1px solid #333; }
        .btn-secondary:hover { background: #1a1a1a; border-color: #444; }
        .input-field { width: 100%; padding: 0.75rem 1rem; background: #0a0a0a; border: 1px solid #222; color: #fff; border-radius: 8px; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: #4ade80; }
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; margin-bottom: 0.5rem; color: #888; font-size: 0.85rem; font-weight: 500; }
        
        .sidebar { width: 260px; background: #0a0a0a; border-right: 1px solid #1a1a1a; display: flex; flex-direction: column; flex-shrink: 0; z-index: 50; transition: transform 0.3s ease; }
        .main-content { flex: 1; display: flex; flexDirection: column; min-width: 0; height: 100vh; overflow: hidden; }
        .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 40; backdrop-filter: blur(2px); }
        .hamburger { display: none; background: none; border: none; color: #fff; cursor: pointer; padding: 0.5rem; }
        
        @media (max-width: 1024px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .sidebar { position: fixed; top: 0; left: 0; height: 100vh; transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .mobile-overlay.open { display: block; }
          .hamburger { display: block; }
          .stat-grid { grid-template-columns: 1fr !important; }
          .topbar-title { display: none; }
          .table-responsive { overflow-x: auto; }
        }
      `}</style>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
              zIndex: 1000, padding: '1rem 2rem', borderRadius: '12px',
              backgroundColor: notification.type === 'success' ? '#065f46' : '#991b1b',
              color: '#fff', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}
          >
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Overlay */}
      <div className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ padding: '1.5rem 1rem' }}>
        <div style={{ padding: '0 0.5rem 2rem', marginBottom: '1rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#4ade80', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: '1.2rem' }}>
              {vendorData.storeName[0]}
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{vendorData.storeName}</h2>
              <p style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }}>Vendor Panel</p>
            </div>
          </div>
          <button className="hamburger" onClick={toggleSidebar} style={{ padding: 0 }}>
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}>
            <Store size={18} /> Overview
          </button>
          <button className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}>
            <Package size={18} /> Products
          </button>
          <button className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}>
            <Box size={18} /> Orders
          </button>
          <button className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}>
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1rem', marginTop: 'auto' }}>
          <div style={{ padding: '1rem', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' }}>Current Commission</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80' }}>{vendorData.commissionRate}%</p>
          </div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', color: '#888', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
            <LogOut size={18} /> Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header style={{ height: '70px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', background: '#0a0a0a', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="hamburger" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className="topbar-title" style={{ fontSize: '1.25rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none' }} className="user-info">
                <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block' }}>{vendorData.ownerName}</span>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>Vendor</span>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#fff' }}>
                {vendorData.ownerName[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
                <Loader2 size={40} className="animate-spin" color="#4ade80" />
                <p style={{ color: '#666' }}>Loading dashboard data...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <div>
                      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div className="stat-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', background: 'rgba(74,222,128,0.1)', color: '#4ade80', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <DollarSign size={22} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '4px', height: 'fit-content' }}>+12%</span>
                          </div>
                          <p style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Revenue</p>
                          <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{vendorData.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="stat-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <TrendingUp size={22} />
                            </div>
                          </div>
                          <p style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Orders</p>
                          <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{orders.length}</p>
                        </div>
                        <div className="stat-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', background: 'rgba(167,139,250,0.1)', color: '#a78bfa', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Package size={22} />
                            </div>
                          </div>
                          <p style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Active Products</p>
                          <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{products.length}</p>
                        </div>
                        <div className="stat-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', background: 'rgba(253,224,71,0.1)', color: '#fde047', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Star size={22} />
                            </div>
                          </div>
                          <p style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Store Rating</p>
                          <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{vendorData.rating} <span style={{ fontSize: '1rem', color: '#666' }}>/ 5.0</span></p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top Selling Products</h3>
                            <button onClick={() => setActiveTab('products')} style={{ background: 'none', border: 'none', color: '#4ade80', fontSize: '0.85rem', cursor: 'pointer' }}>View All</button>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {products.slice(0, 3).map(p => (
                              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>
                                <img src={p.image_url} alt={p.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</p>
                                  <p style={{ color: '#888', fontSize: '0.8rem' }}>₹{p.price}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <p style={{ fontWeight: 700 }}>{p.sales || 0}</p>
                                  <p style={{ color: '#888', fontSize: '0.75rem' }}>Sales</p>
                                </div>
                              </div>
                            ))}
                            {products.length === 0 && <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>No products yet</p>}
                          </div>
                        </div>

                        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Orders</h3>
                            <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: '#4ade80', fontSize: '0.85rem', cursor: 'pointer' }}>View All</button>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.slice(0, 3).map(o => {
                              const sc = STATUS_COLORS[o.status] || STATUS_COLORS.Processing;
                              return (
                                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>
                                  <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>ORD-{o.id}</p>
                                    <p style={{ color: '#888', fontSize: '0.8rem' }}>{o.customer_name || o.customer || 'Unknown Customer'}</p>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>₹{o.total}</p>
                                    <span className="badge" style={{ background: sc.bg, color: sc.text, marginTop: '4px' }}>{o.status}</span>
                                  </div>
                                </div>
                              )
                            })}
                            {orders.length === 0 && <p style={{ color: '#555', textAlign: 'center', padding: '2rem' }}>No orders yet</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRODUCTS TAB */}
                  {activeTab === 'products' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Product Catalog</h2>
                          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.2rem' }}>Manage your inventory and pricing.</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                          <Plus size={16} /> Add New Product
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1 1 250px' }}>
                          <Search size={16} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                          <input type="text" placeholder="Search products..." style={{ ...inputStyle, paddingLeft: '2.5rem' } as any} />
                        </div>
                        <button className="btn btn-secondary"><Filter size={16} /> Filter</button>
                      </div>

                      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }} className="table-responsive">
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Stock</th>
                              <th>Status</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map(p => {
                              const sc = STATUS_COLORS[p.status || 'Active'] || STATUS_COLORS.Active;
                              return (
                                <tr key={p.id}>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                      <img src={p.image_url} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                                    </div>
                                  </td>
                                  <td style={{ color: '#888' }}>{p.category}</td>
                                  <td style={{ fontWeight: 600 }}>₹{p.price}</td>
                                  <td>
                                    <span style={{ color: p.stock > 10 ? '#fff' : p.stock > 0 ? '#fde047' : '#f87171' }}>
                                      {p.stock} units
                                    </span>
                                  </td>
                                  <td>
                                    <span className="badge" style={{ background: sc.bg, color: sc.text }}>{p.status}</span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                      <button style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Edit size={14} /></button>
                                      <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#f87171', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                        {products.length === 0 && <div style={{ padding: '4rem', textAlign: 'center', color: '#555' }}>No products found. Start by adding one!</div>}
                      </div>
                    </div>
                  )}

                  {/* ORDERS TAB */}
                  {activeTab === 'orders' && (
                    <div>
                      <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Order Management</h2>
                        <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.2rem' }}>Track and fulfill customer orders.</p>
                      </div>

                      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }} className="table-responsive">
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Customer</th>
                              <th>Total</th>
                              <th>Status</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map(o => {
                              const sc = STATUS_COLORS[o.status] || STATUS_COLORS.Processing;
                              return (
                                <tr key={o.id}>
                                  <td style={{ fontWeight: 600, color: '#4ade80', fontFamily: 'monospace' }}>ORD-{o.id}</td>
                                  <td style={{ color: '#888' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}</td>
                                  <td style={{ fontWeight: 500 }}>{o.customer_name || o.customer || 'Unknown'}</td>
                                  <td style={{ fontWeight: 600 }}>₹{o.total}</td>
                                  <td>
                                    <span className="badge" style={{ background: sc.bg, color: sc.text }}>{o.status}</span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>View Details</button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                        {orders.length === 0 && <div style={{ padding: '4rem', textAlign: 'center', color: '#555' }}>No orders yet.</div>}
                      </div>
                    </div>
                  )}

                  {/* SETTINGS TAB */}
                  {activeTab === 'settings' && (
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Store Settings</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '2rem' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Store size={18} color="#4ade80" /> Store Profile
                          </h3>
                          <div className="form-group">
                            <label className="form-label">Store Name</label>
                            <input type="text" className="input-field" defaultValue={vendorData.storeName} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Owner Name</label>
                            <input type="text" className="input-field" defaultValue={vendorData.ownerName} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Store Description</label>
                            <textarea className="input-field" rows={4} defaultValue={vendorData.description}></textarea>
                          </div>
                          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Save Profile</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Mail size={18} color="#60a5fa" /> Contact Information
                            </h3>
                            <div className="form-group">
                              <label className="form-label">Business Email</label>
                              <input type="email" className="input-field" defaultValue={vendorData.email} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label">Phone Number</label>
                              <input type="text" className="input-field" defaultValue={vendorData.phone} />
                            </div>
                          </div>

                          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <CreditCard size={18} color="#a78bfa" /> Payout Settings
                            </h3>
                            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Update Bank Details</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '600px',
                background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px',
                padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Add New Product</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><X size={24} /></button>
              </div>

              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    required
                    className="input-field"
                    placeholder="e.g. Vintage Oversized Hoodie"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="input-field"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option>Streetwear</option>
                      <option>T-Shirts</option>
                      <option>Hoodies</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      required
                      type="number"
                      className="input-field"
                      placeholder="999"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      required
                      type="number"
                      className="input-field"
                      placeholder="50"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL *</label>
                    <input
                      required
                      className="input-field"
                      placeholder="https://images.unsplash.com/..."
                      value={newProduct.image_url}
                      onChange={e => setNewProduct({...newProduct, image_url: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Create Product</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}