'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function CartSidebar() {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
            }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '450px',
              height: '100%',
              backgroundColor: '#ffffff',
              color: '#000000',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.05)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid #eaeaea',
            }}
          >
            {/* Header */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ShoppingCart size={24} color="#000" />
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#000', fontWeight: 800 }}>Your Cart</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ color: '#888', transition: 'color 0.2s' }}>
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#888' }}>
                  <ShoppingCart size={64} style={{ marginBottom: '1rem', opacity: 0.15 }} />
                  <p style={{ fontSize: '1.2rem' }}>Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    style={{ marginTop: '2rem', color: '#000', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ 
                        width: '80px', 
                        height: '100px', 
                        backgroundColor: item.metadata?.isCustom ? item.metadata.hexColor || '#f8f9fa' : '#f8f9fa', 
                        borderRadius: '6px', 
                        overflow: 'hidden', 
                        flexShrink: 0,
                        border: '1px solid #eaeaea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {item.metadata?.isCustom ? (
                          <>
                            {item.metadata.decals && item.metadata.decals.length > 0 ? (
                              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <img src={item.metadata.decals[0].url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }} />
                                {item.metadata.decals.length > 1 && (
                                  <span style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.55rem', fontWeight: 'bold', padding: '0.1rem 0.25rem', borderRadius: '4px', zIndex: 5 }}>
                                    +{item.metadata.decals.length - 1}
                                  </span>
                                )}
                              </div>
                            ) : item.metadata.decalUrl ? (
                              <img src={item.metadata.decalUrl} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain', zIndex: 2 }} />
                            ) : (
                              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#888', opacity: 0.8 }}>3D SHIRT</span>
                            )}
                            <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.metadata.hexColor, border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', zIndex: 10 }} />
                          </>
                        ) : (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700, color: '#000' }}>{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {item.metadata?.isCustom && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                            <div>Size: <span style={{ color: '#000', fontWeight: 600 }}>{item.metadata.size}</span></div>
                            <div>Color: <span style={{ color: '#000', fontWeight: 600 }}>{item.metadata.color}</span></div>
                          </div>
                        )}

                        <p style={{ color: '#666', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: 600 }}>{formatPrice(item.price)}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#000' }}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div style={{ padding: '2rem', borderTop: '1px solid #eaeaea', backgroundColor: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  <span style={{ color: '#666', fontWeight: 500 }}>Subtotal</span>
                  <span style={{ fontWeight: 800, color: '#000' }}>{formatPrice(subtotal)}</span>
                </div>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)} style={{ textDecoration: 'none' }}>
                  <button 
                    style={{ 
                      width: '100%', 
                      padding: '1.2rem', 
                      backgroundColor: '#e11d48', 
                      color: '#fff', 
                      fontWeight: 800, 
                      borderRadius: '8px', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontSize: '1rem',
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 12px rgba(225, 29, 72, 0.15)' 
                    }}
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </Link>
                <p style={{ textAlign: 'center', color: '#888', fontSize: '0.75rem', marginTop: '1rem' }}>
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
