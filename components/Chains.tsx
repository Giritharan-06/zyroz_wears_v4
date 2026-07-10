'use client';

import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

interface Props {
  chains: { id: string, title: string, image: string, price: number | string }[];
}

export default function Chains({ chains }: Props) {
  const { addToCart } = useCart();

  return (
    <section id="chains" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1rem', textAlign: 'center' }}>Men's Luxury Chains</h2>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '3rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Complete the look. Strictly for him.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {chains.map((chain, idx) => (
              <motion.div 
                key={chain.id} 
                className="category-card"
                style={{ position: 'relative', height: '600px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#111' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Link href={`/product/${chain.id}`} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
                  <img 
                    src={chain.image} 
                    alt={chain.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: chain.id === 'silver' ? 'grayscale(100%)' : 'none'
                    }} 
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: 'white' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{chain.title}</h3>
                    <p style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', fontWeight: 300 }}>{formatPrice(chain.price)}</p>
                  </div>
                </Link>
                <div style={{ position: 'absolute', bottom: '2rem', right: '2rem' }}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: chain.id,
                        name: chain.title,
                        price: Number(chain.price),
                        image: chain.image
                      });
                    }}
                    className="cta-button" 
                    style={{ width: '120px' }}
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
