'use client';
import Navbar from '@/components/Navbar';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([
    { id: 2, name: 'Couple Sets', price: 80.00, image: '/asessts/couple_view.jpg' },
    { id: 5, name: 'Luxury Gold Chain', price: 120.00, image: '/asessts/chains2.jpg' },
  ]);

  const handleRemove = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    handleRemove(item.id);
  };

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000', paddingTop: '15vh', paddingBottom: '10vh' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <Heart size={32} fill="#e11d48" color="#e11d48" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f9fafb', borderRadius: '16px', border: '1px solid #eaeaea' }}>
            <Heart size={48} style={{ opacity: 0.15, marginBottom: '1.5rem', display: 'inline-block' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
            <p style={{ color: '#666666', marginBottom: '2rem' }}>Explore products and save your favorites to purchase later.</p>
            <Link href="/" style={{ padding: '0.9rem 2rem', background: '#000000', color: '#ffffff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Explore Shop <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {wishlistItems.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '16px', background: '#ffffff', position: 'relative' }} className="mobile-stack">
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#f8f9fa' }} />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#000000' }}>{item.name}</h3>
                  <p style={{ fontSize: '1.15rem', color: '#0f766e', fontWeight: 700 }}>₹{item.price.toLocaleString('en-IN')}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    style={{ padding: '0.9rem 1.5rem', background: '#000000', color: '#ffffff', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                  >
                    <ShoppingCart size={16} /> Move to Cart
                  </button>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    style={{ padding: '0.9rem', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
