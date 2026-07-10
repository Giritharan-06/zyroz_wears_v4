'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CreditCard, ChevronRight, Check, Star, Loader2, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/format';

export default function ProductDetailsClient({ product }: { product: { id: number | string; name: string; price: number | string; images: string[]; description?: string; category?: string } }) {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<Array<{ id: number; customer_name: string; rating: number; comment: string; created_at: string }>>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  const { addToCart } = useCart();
  const router = useRouter();

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setReviewsLoading(false); }
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: newReview.name,
          rating: newReview.rating,
          comment: newReview.comment
        }),
      });
      if (res.ok) {
        setNewReview({ name: '', rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} - ${selectedSize}`,
      price: Number(product.price),
      image: mainImage
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout'); // Assuming a checkout route or cart
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
      
      {/* Gallery Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ 
          width: '100%', 
          aspectRatio: '3/4', 
          backgroundColor: '#111', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid #222'
        }}>
          <AnimatePresence mode="wait">
            <motion.img 
              key={mainImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={mainImage} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AnimatePresence>
        </div>
        
        {/* Thumbnails */}
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {product.images.map((img: string, idx: number) => (
            <button 
              key={idx}
              onClick={() => setMainImage(img)}
              style={{ 
                width: '80px', 
                height: '100px', 
                flexShrink: 0,
                backgroundColor: '#111',
                border: `2px solid ${mainImage === img ? '#fff' : 'transparent'}`,
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                padding: 0,
                opacity: mainImage === img ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
            >
              <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Info Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>Store</span> <ChevronRight size={14} /> <span>{product.category || 'Collection'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: '1.1' }}>{product.name}</h1>
          <p style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: '#4ade80', fontWeight: 600 }}>{formatPrice(product.price)}</p>
        </div>

        <div style={{ borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: '2rem 0' }}>
          <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: '1.6' }}>
            {product.description || "Experience the perfect blend of style and comfort. Designed meticulously to provide a premium feel, making it an essential addition to your collection."}
          </p>
        </div>

        {/* Size Selector */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Size</span>
            <button style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Size Guide</button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: `1px solid ${selectedSize === size ? '#fff' : '#333'}`,
                  background: selectedSize === size ? '#fff' : '#111',
                  color: selectedSize === size ? '#000' : '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={handleAddToCart}
            style={{
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              background: added ? '#4ade80' : '#111',
              color: added ? '#000' : '#fff',
              border: '1px solid #333',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {added ? <><Check size={20} /> Added to Cart</> : <><ShoppingBag size={20} /> Add to Cart</>}
          </button>
          
          <button 
            onClick={handleBuyNow}
            style={{
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <CreditCard size={20} /> Buy It Now
          </button>
        </div>

        {/* Guarantees */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
             <Check size={16} color="#4ade80" /> <span>Free Global Shipping</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
             <Check size={16} color="#4ade80" /> <span>30-Day Returns</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
             <Check size={16} color="#4ade80" /> <span>Secure Checkout</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
             <Check size={16} color="#4ade80" /> <span>Premium Quality</span>
          </div>
        </div>

      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid #222', paddingTop: '4rem' }}>
        <div className="mobile-flex-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>Customer Reviews</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ display: 'flex', color: '#fde047' }}>
                 {[1, 2, 3, 4, 5].map(star => <Star key={star} size={20} fill={star <= 4.5 ? "#fde047" : "none"} />)}
               </div>
               <span style={{ color: '#888', fontSize: '1.1rem' }}>Based on 12 reviews</span>
            </div>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('review-form');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '0.8rem 1.5rem', background: '#fff', color: '#000', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', width: 'fit-content' }}
          >
            Write a Review
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {reviewsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1/-1', color: '#555' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1/-1', color: '#555' }}>
              <MessageSquare size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((rev, i) => (
              <motion.div 
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{ background: '#0f0f0f', padding: '2rem', borderRadius: '16px', border: '1px solid #1a1a1a' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{rev.customer_name}</span>
                  <span style={{ color: '#555', fontSize: '0.85rem' }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', color: '#fde047', marginBottom: '1rem' }}>
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill={star <= rev.rating ? "#fde047" : "none"} />)}
                </div>
                <p style={{ color: '#aaa', lineHeight: 1.6 }}>{rev.comment}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Review Form */}
        <div id="review-form" style={{ marginTop: '5rem', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '24px', padding: '3rem', maxWidth: '700px', margin: '5rem auto 0' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Share Your Experience</h3>
          <form onSubmit={handlePostReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ color: '#888', fontSize: '0.9rem' }}>Full Name</label>
                 <input 
                   required
                   type="text" 
                   value={newReview.name}
                   onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                   placeholder="John Doe" 
                   style={{ padding: '1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: '#fff', outline: 'none' }} 
                 />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ color: '#888', fontSize: '0.9rem' }}>Rating</label>
                  <select 
                    value={newReview.rating}
                    onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    style={{ padding: '1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
               </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: '#888', fontSize: '0.9rem' }}>Your Review</label>
              <textarea 
                required
                rows={5} 
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Tell us what you liked or how we can improve..." 
                style={{ padding: '1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'vertical' }} 
              />
            </div>
            <button 
              disabled={submitting}
              style={{ padding: '1.2rem', background: '#fff', color: '#000', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {submitting ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Post Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
