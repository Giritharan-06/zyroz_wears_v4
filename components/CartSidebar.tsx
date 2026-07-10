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
              backgroundColor: 'rgba(0,0,0,0.7)',
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
              backgroundColor: '#0a0a0a',
              color: 'white',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid #222',
            }}
          >
            {/* Header */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ShoppingCart size={24} />
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Your Cart</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ color: '#888', transition: 'color 0.2s' }}>
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#555' }}>
                  <ShoppingCart size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                  <p style={{ fontSize: '1.2rem' }}>Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    style={{ marginTop: '2rem', color: 'white', textDecoration: 'underline' }}
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
                        backgroundColor: item.metadata?.isCustom ? item.metadata.hexColor || '#111' : '#111', 
                        borderRadius: '6px', 
                        overflow: 'hidden', 
                        flexShrink: 0,
                        border: '1px solid #222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {item.metadata?.isCustom ? (
                          <>
                            {item.metadata.decalUrl ? (
                              <img src={item.metadata.decalUrl} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain', zIndex: 2 }} />
                            ) : (
                              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#888', opacity: 0.8 }}>3D SHIRT</span>
                            )}
                            <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.metadata.hexColor, border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }} />
                          </>
                        ) : (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} style={{ color: '#ff4d4d' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {item.metadata?.isCustom && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                            <div>Size: <span style={{ color: '#fff', fontWeight: 600 }}>{item.metadata.size}</span></div>
                            <div>Color: <span style={{ color: '#fff', fontWeight: 600 }}>{item.metadata.color}</span></div>
                          </div>
                        )}

                        <p style={{ color: '#888', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: 500 }}>{formatPrice(item.price)}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
              <div style={{ padding: '2rem', borderTop: '1px solid #222', backgroundColor: '#0f0f0f' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                  <span style={{ color: '#888' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                </div>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)} style={{ textDecoration: 'none' }}>
                  <button className="cta-button" style={{ width: '100%', padding: '1.2rem' }}>
                    Checkout
                  </button>
                </Link>
                <p style={{ textAlign: 'center', color: '#444', fontSize: '0.8rem', marginTop: '1rem' }}>
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
