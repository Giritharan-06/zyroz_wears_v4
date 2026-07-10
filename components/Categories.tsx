'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Props {
  categories: { id: string, title: string, image: string, price: number | string }[];
}

export default function Categories({ categories }: Props) {
  const { addToCart } = useCart();

  return (
    <section id="categories" className="container section">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>Our Collections</h2>
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div key={cat.id} style={{ position: 'relative' }}>
              <Link href={`/collection/${cat.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                <motion.div 
                  className="category-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  style={{ backgroundColor: '#111' }}
                >
                  <img src={cat.image} alt={cat.title} className="category-image" />
                  <div className="category-overlay">
                    <div style={{ width: '100%' }}>
                      <h3 className="category-title" style={{ marginBottom: '0.5rem' }}>{cat.title}</h3>
                      <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>${Number(cat.price).toFixed(2)}</p>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart({
                            id: cat.id,
                            name: cat.title,
                            price: Number(cat.price),
                            image: cat.image
                          });
                        }}
                        className="cta-button"
                        style={{ width: '100%', padding: '0.8rem' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
