'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, User, Package, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when user clicks a link
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/asessts/Zyroz_logo.jpeg" alt="ZYROZ Logo" style={{ height: '32px', objectFit: 'contain', borderRadius: '4px' }} />
          <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.05em' }}>ZYROZ STUDIO</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links" style={{ alignItems: 'center' }}>
          <Link href="/customize" className="nav-link" style={{ color: '#3b82f6', fontWeight: 700 }}>3D Customizer</Link>
          <Link href="/collection/men" className="nav-link">Men</Link>
          <Link href="/collection/couple" className="nav-link">Couples</Link>
          <Link href="/collection/festival" className="nav-link">Festival</Link>
          <Link href="/collection/gold" className="nav-link">Chains</Link>
          
          {user ? (
            <>
              <Link href="/orders" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} /> My Orders
              </Link>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', margin: '0 0.5rem' }}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {totalItems}
                  </span>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingLeft: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.15)', height: '24px' }}>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{user.name}</div>
                <button onClick={logout} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '1rem' }}>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/customize" style={{ background: '#3b82f6', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>Open Studio</Link>
            </div>
          )}
        </div>

        {/* Mobile Icons and Menu Button */}
        <div className="mobile-actions" style={{ display: 'none', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setIsCartOpen(true)} style={{ position: 'relative', color: 'white' }}>
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '14px', height: '14px', fontSize: '0.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totalItems}
              </span>
            )}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ color: 'white' }}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ 
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
              background: '#000', zIndex: 99, display: 'flex', flexDirection: 'column', 
              padding: '6rem 5vw 2rem', gap: '2rem' 
            }}
          >
            <Link href="/customize" className="mobile-nav-link" onClick={closeMenu} style={{ color: '#3b82f6', fontWeight: 700 }}>3D Customizer</Link>
            <Link href="/collection/men" className="mobile-nav-link" onClick={closeMenu}>Men Collection</Link>
            <Link href="/collection/couple" className="mobile-nav-link" onClick={closeMenu}>Couples Collection</Link>
            <Link href="/collection/festival" className="mobile-nav-link" onClick={closeMenu}>Festival Edit</Link>
            <Link href="/collection/gold" className="mobile-nav-link" onClick={closeMenu}>Chains</Link>
            
            {user ? (
              <>
                <Link href="/orders" className="mobile-nav-link" onClick={closeMenu}>My Orders</Link>
                <div style={{ marginTop: 'auto', padding: '2rem 0', borderTop: '1px solid #111' }}>
                  <p style={{ color: '#555', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Logged in as</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user.name}</div>
                    <button onClick={() => { logout(); closeMenu(); }} style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Logout <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/login" style={{ textAlign: 'center', padding: '1rem', border: '1px solid #222', borderRadius: '12px', color: '#fff' }} onClick={closeMenu}>Login</Link>
                <Link href="/customize" style={{ textAlign: 'center', padding: '1rem', background: '#3b82f6', color: '#fff', borderRadius: '12px', fontWeight: 700 }} onClick={closeMenu}>Open Studio</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .mobile-nav-link { font-size: 2rem; fontWeight: 800; text-transform: uppercase; color: #fff; text-decoration: none; }
        @media (max-width: 768px) {
          .mobile-actions { display: flex !important; }
        }
      `}</style>
    </>
  );
}
