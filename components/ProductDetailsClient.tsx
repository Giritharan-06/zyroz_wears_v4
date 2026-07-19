'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CreditCard, ChevronRight, Check, Star, Loader2, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/format';

export default function ProductDetailsClient({ product }: { product: { id: number | string; name: string; price: number | string; images: string[]; description?: string; category?: string; offer?: number } }) {
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
          customerName: newReview.name,
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
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image: product.images[0],
      metadata: {
        isCustom: false,
        size: selectedSize
      }
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} - ${selectedSize}`,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image: product.images[0],
      metadata: {
        isCustom: false,
        size: selectedSize
      }
    });
    router.push('/checkout');
  };

  const hasOffer = product.offer !== undefined && product.offer > 0;
  const originalPrice = hasOffer 
    ? Math.round(Number(product.price) / (1 - (product.offer || 0) / 100))
    : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Gallery Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ 
          width: '100%', 
          aspectRatio: '3/4', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '16px', 
          overflow: 'hidden',
          border: '1px solid #eaeaea'
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
                backgroundColor: '#f8f9fa',
                border: `2px solid ${mainImage === img ? '#000' : 'transparent'}`,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            <span>Store</span> <ChevronRight size={14} /> <span>{product.category || 'Collection'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: '1.1', color: '#000' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: '#0f766e', fontWeight: 700 }}>{formatPrice(product.price)}</span>
            {hasOffer && (
              <>
                <span style={{ fontSize: '1.2rem', color: '#888', textDecoration: 'line-through' }}>{formatPrice(originalPrice!)}</span>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{product.offer}% OFF</span>
              </>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea', padding: '2rem 0' }}>
          <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: '1.6' }}>
            {product.description || "Experience the perfect blend of style and comfort. Designed meticulously to provide a premium feel, making it an essential addition to your collection."}
          </p>
        </div>

        {/* Size Selector */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Size</span>
            <button style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Size Guide</button>
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
                  border: `1px solid ${selectedSize === size ? '#000' : '#e2e8f0'}`,
                  background: selectedSize === size ? '#000' : '#f8f9fa',
                  color: selectedSize === size ? '#fff' : '#000',
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
              background: added ? '#10b981' : '#f3f4f6',
              color: added ? '#fff' : '#000',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontWeight: 800,
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
              background: '#e11d48',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
             <Check size={16} color="#10b981" /> <span>Free Global Shipping</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
             <Check size={16} color="#10b981" /> <span>30-Day Returns</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
             <Check size={16} color="#10b981" /> <span>Secure Checkout</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
             <Check size={16} color="#10b981" /> <span>Premium Quality</span>
          </div>
        </div>

      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid #eaeaea', paddingTop: '4rem', gridColumn: '1/-1' }}>
        <div className="mobile-flex-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem', color: '#000' }}>Customer Reviews</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ display: 'flex', color: '#fde047' }}>
                 {[1, 2, 3, 4, 5].map(star => <Star key={star} size={20} fill={star <= 4.5 ? "#eab308" : "none"} color="#eab308" />)}
               </div>
               <span style={{ color: '#666', fontSize: '1.1rem' }}>Based on reviews</span>
            </div>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('review-form');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '0.8rem 1.5rem', background: '#000', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', width: 'fit-content' }}
          >
            Write a Review
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {reviewsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1/-1', color: '#666' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', gridColumn: '1/-1', color: '#666' }}>
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
                style={{ background: '#f9fafb', padding: '2rem', borderRadius: '16px', border: '1px solid #eaeaea' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#000' }}>{rev.customer_name}</span>
                  <span style={{ color: '#666', fontSize: '0.85rem' }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', color: '#fde047', marginBottom: '1rem' }}>
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill={star <= rev.rating ? "#eab308" : "none"} color="#eab308" />)}
                </div>
                <p style={{ color: '#4b5563', lineHeight: 1.6 }}>{rev.comment}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Review Form */}
        <div id="review-form" style={{ marginTop: '5rem', background: '#f9fafb', border: '1px solid #eaeaea', borderRadius: '24px', padding: '3rem', maxWidth: '700px', margin: '5rem auto 0' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', color: '#000' }}>Share Your Experience</h3>
          <form onSubmit={handlePostReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ color: '#666', fontSize: '0.9rem' }}>Full Name</label>
                 <input 
                   required
                   type="text" 
                   value={newReview.name}
                   onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                   placeholder="John Doe" 
                   style={{ padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', color: '#000', outline: 'none' }} 
                 />
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ color: '#666', fontSize: '0.9rem' }}>Rating</label>
                  <select 
                    value={newReview.rating}
                    onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    style={{ padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', color: '#000', outline: 'none' }}
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
               <label style={{ color: '#666', fontSize: '0.9rem' }}>Your Review</label>
               <textarea 
                 required
                 rows={5} 
                 value={newReview.comment}
                 onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                 placeholder="Tell us what you liked or how we can improve..." 
                 style={{ padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', color: '#000', outline: 'none', resize: 'vertical' }} 
               />
            </div>
            <button 
              disabled={submitting}
              style={{ padding: '1.2rem', background: '#000', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {submitting ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Post Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
