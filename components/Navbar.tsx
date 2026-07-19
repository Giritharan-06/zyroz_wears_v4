'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingCart, User, Package, LogOut, Menu, X, 
  Heart, Store, Gift, CreditCard, Bell, Headphones, 
  Tv, Download, Award, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Close mobile menu when user clicks a link
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Rebranded dropdown items (ZYROZ Elite Club hidden for future use)
  const dropdownItems = [
    { label: 'My Profile', icon: User, href: '/profile' },
    { label: 'Orders', icon: Package, href: '/orders' },
    { label: 'Wishlist', icon: Heart, href: '/wishlist' },
    { label: 'Become a Seller', icon: Store, href: '/vendor' },
    { label: 'Rewards', icon: Gift, href: '/rewards' },
    { label: 'Gift Cards', icon: CreditCard, href: '/gift-cards' },
    { label: 'Notification Preferences', icon: Bell, href: '/notifications' },
    { label: '24x7 Customer Care', icon: Headphones, href: '/support' },
    { label: 'Advertise', icon: Tv, href: '/advertise' },
    { label: 'Download App', icon: Download, href: '/download' },
  ];

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        {/* Top Announcement Bar */}
        <div style={{ backgroundColor: '#e11d48', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.5rem 5vw', textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚡ ZYROZ CLUB DEALS: BUY 2 GET 1 FREE ON ALL CUSTOM APPARELS ⚡</span>
          <Link href="/customize" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 900 }}>DESIGN NOW</Link>
        </div>

        <nav className="navbar" style={{ position: 'static' }}>
          <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/asessts/Zyroz_logo.jpeg" alt="ZYROZ Logo" style={{ height: '32px', objectFit: 'contain', borderRadius: '4px' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.05em' }}>ZYROZ STUDIO</span>
          </Link>

          {/* Desktop Nav (Chains hidden, Women section added) */}
          <div className="nav-links" style={{ alignItems: 'center' }}>
            <Link href="/customize" className="nav-link" style={{ color: '#3b82f6', fontWeight: 700 }}>3D Customizer</Link>
            <Link href="/collection/men" className="nav-link">Men</Link>
            <Link href="/collection/women" className="nav-link">Women</Link>
            <Link href="/collection/couple" className="nav-link">Couples</Link>
            <Link href="/collection/special" className="nav-link">Special Edition</Link>
            
            {user ? (
              <>
                <Link href="/orders" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={18} /> My Orders
                </Link>
                
                <button 
                  onClick={() => setIsCartOpen(true)}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'black', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', margin: '0 0.5rem' }}
                >
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: 'black', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Vertical Divider */}
                <div style={{ width: '1px', backgroundColor: 'rgba(0,0,0,0.12)', height: '24px', marginLeft: '0.5rem' }} />

                {/* Hoverable User Dropdown Menu */}
                <div 
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <button 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.4rem', 
                      color: 'black', 
                      fontWeight: 700, 
                      fontSize: '0.85rem', 
                      letterSpacing: '0.05em', 
                      textTransform: 'uppercase',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {user.name}
                    <ChevronDown size={14} style={{ transform: isUserDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          width: '260px',
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(0,0,0,0.06)',
                          padding: '0.5rem 0',
                          zIndex: 1001,
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {dropdownItems.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                              <Link 
                                key={idx}
                                href={item.href}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  padding: '0.7rem 1.2rem',
                                  color: '#333333',
                                  fontWeight: 500,
                                  fontSize: '0.85rem',
                                  transition: 'all 0.2s',
                                  textTransform: 'none',
                                  letterSpacing: 'normal'
                                }}
                                className="dropdown-menu-item"
                              >
                                <IconComponent size={16} color="#666666" />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}
                          
                          {/* Divider */}
                          <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)', margin: '0.4rem 0' }} />

                          {/* Log Out Button */}
                          <button
                            onClick={logout}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.7rem 1.2rem',
                              width: '100%',
                              textAlign: 'left',
                              color: '#ef4444',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              transition: 'all 0.2s',
                              cursor: 'pointer'
                            }}
                            className="dropdown-menu-item logout"
                          >
                            <LogOut size={16} color="#ef4444" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            <button onClick={() => setIsCartOpen(true)} style={{ position: 'relative', color: 'black' }}>
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'black', color: 'white', borderRadius: '50%', width: '14px', height: '14px', fontSize: '0.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ color: 'black' }}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

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
            <Link href="/collection/women" className="mobile-nav-link" onClick={closeMenu}>Women Collection</Link>
            <Link href="/collection/couple" className="mobile-nav-link" onClick={closeMenu}>Couples Collection</Link>
            <Link href="/collection/special" className="mobile-nav-link" onClick={closeMenu}>Special Edition</Link>
            
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
        .dropdown-menu-item:hover {
          background-color: #f9fafb;
          color: #e11d48 !important;
        }
        .dropdown-menu-item.logout:hover {
          background-color: #fef2f2;
          color: #ef4444 !important;
        }
        @media (max-width: 768px) {
          .mobile-actions { display: flex !important; }
        }
      `}</style>
    </>
  );
}
