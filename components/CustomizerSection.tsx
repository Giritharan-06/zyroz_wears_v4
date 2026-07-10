'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shirt, Scissors, Brush, Box, Link as ChainLink } from 'lucide-react';

const customCategories = [
  {
    id: 't-shirts',
    title: 'Custom T-Shirts',
    description: 'Premium cotton, perfect fit. Choose your fabric, collar style, and graphic prints.',
    icon: <Shirt size={48} strokeWidth={1.5} />,
    options: ['Fabric Weight', 'Neckline', 'Sleeve Length', 'Custom Graphics'],
    color: '#3b82f6'
  },
  {
    id: 'shirts',
    title: 'Bespoke Shirts',
    description: 'Tailored to your exact measurements. Select from oxford, linen, or silk.',
    icon: <Scissors size={48} strokeWidth={1.5} />,
    options: ['Collar Type', 'Cuff Style', 'Fit Profile', 'Monogramming'],
    color: '#a78bfa'
  },
  {
    id: 'pants',
    title: 'Tailored Pants',
    description: 'From smart trousers to casual cargo pants. Designed for comfort and durability.',
    icon: <Box size={48} strokeWidth={1.5} />,
    options: ['Waistband', 'Leg Opening', 'Pocket Styles', 'Fabric Tech'],
    color: '#4ade80'
  },
  {
    id: 'chains',
    title: 'Custom Chains',
    description: 'Crafted with precision. Choose your metal, links, and personalized pendants.',
    icon: <ChainLink size={48} strokeWidth={1.5} />,
    options: ['Metal Type', 'Link Design', 'Chain Length', 'Pendant Inlay'],
    color: '#fde047'
  }
];

export default function CustomizerSection() {
  return (
    <section className="container section" style={{ padding: '6rem 5vw' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Build Your Signature Look
        </h2>
        <p style={{ color: '#888', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Experience professional-grade customization. Define every detail from fabric to finish, tailored perfectly to your specifications.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {customCategories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            style={{
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.4s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = cat.color;
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 10px 40px -10px ${cat.color}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ color: cat.color, marginBottom: '1.5rem' }}>
              {cat.icon}
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem' }}>{cat.title}</h3>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '2rem', flexGrow: 1 }}>{cat.description}</p>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Customization Options</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {cat.options.map((opt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.95rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: cat.color }} />
                    {opt}
                  </li>
                ))}
              </ul>
            </div>

            <Link href={`/customize?type=${cat.id}`} style={{
              display: 'block',
              textAlign: 'center',
              padding: '1rem',
              borderRadius: '12px',
              background: '#111',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '500',
              border: '1px solid #333',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#111';
              e.currentTarget.style.color = '#fff';
            }}
            >
              Start Customizing
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
