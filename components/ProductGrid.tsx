'use client';

import React from 'react';
import { motion } from 'framer-motion';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

interface Props {
  products: Product[];
  title: string;
}

export default function ProductGrid({ products, title }: Props) {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '3rem', textAlign: 'left', fontWeight: 800 }}>{title}</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '3rem 2rem' 
          }}>
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                style={{ position: 'relative' }}
                className="product-card-container"
              >
                <div style={{ 
                  position: 'relative', 
                  aspectRatio: '3/4', 
                  overflow: 'hidden', 
                  borderRadius: '12px', 
                  backgroundColor: '#111',
                  marginBottom: '1.5rem',
                  cursor: 'pointer'
                }}>
                  <Link href={`/product/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <motion.img 
                      src={product.image_url} 
                      alt={product.name}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block'
                      }} 
                    />
                  </Link>
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '1rem', 
                    left: '1rem', 
                    right: '1rem',
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s ease'
                  }} className="product-card-action">
                     <AddToCartButton 
                      item={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image_url
                      }}
                      style={{ 
                        width: '100%', 
                        padding: '1rem',
                        backgroundColor: 'white',
                        color: 'black',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <p style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{product.category}</p>
                  <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', cursor: 'pointer' }}>{product.name}</h3>
                  </Link>
                  <p style={{ fontSize: '1.2rem', fontWeight: 500, color: '#fff' }}>{formatPrice(product.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <style jsx>{`
            .product-card-container:hover .product-card-action {
              opacity: 1 !important;
              transform: translateY(0) !important;
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
}
