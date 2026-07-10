'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="hero">
      <motion.div style={{ y: yPos, opacity, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="hero-title">ZYROZ</h1>
        <p className="hero-subtitle">Wear Your Identity</p>
        <p style={{ marginTop: '1rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Custom Premium Wear
        </p>
      </motion.div>
    </section>
  );
}
