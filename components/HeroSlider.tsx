'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    id: 1,
    title: 'T-SHIRTS',
    subtext: 'REGULAR | OVERSIZED | VESTS',
    link: '/customize',
    image: '/asessts/hero_slide_tshirts.png',
    textColor: '#000000',
    align: 'right'
  },
  {
    id: 2,
    title: 'WOMEN EDIT',
    subtext: 'CROP TOPS | OVERSIZED TEES | HIGH-WAIST PANTS',
    link: '/collection/women',
    image: '/asessts/couple_mockup_2.png',
    textColor: '#000000',
    align: 'right'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <div style={{ position: 'relative', width: '100%', height: '65vh', backgroundColor: '#fff', overflow: 'hidden', borderBottom: '1px solid #eee' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backgroundImage: `url(${slide.image})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: slide.align === 'right' ? 'flex-end' : 'flex-start',
            padding: '0 10vw'
          }}
        >
          {/* Slide Text Content Overlay */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              maxWidth: '500px',
              zIndex: 10,
              gap: '1rem',
              marginRight: slide.align === 'right' ? '5vw' : '0',
              marginLeft: slide.align === 'left' ? '5vw' : '0'
            }}
          >
            <h1 
              style={{ 
                fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', 
                fontWeight: 900, 
                color: slide.textColor, 
                letterSpacing: '0.02em',
                lineHeight: 0.9,
                margin: 0,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {slide.title}
            </h1>
            
            <Link 
              href={slide.link} 
              style={{ 
                display: 'inline-block',
                border: `2px solid ${slide.textColor}`, 
                color: slide.textColor,
                padding: '0.6rem 2rem', 
                fontSize: '0.9rem',
                fontWeight: 800, 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase',
                textDecoration: 'none',
                marginTop: '0.5rem',
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease-in-out'
              }}
              className="explore-btn"
            >
              TAP TO EXPLORE
            </Link>
            
            <p 
              style={{ 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                color: '#666', 
                letterSpacing: '0.05em', 
                margin: 0,
                marginTop: '0.5rem'
              }}
            >
              {slide.subtext}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Left Arrow */}
      <button 
        onClick={handlePrev}
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '20px', 
          transform: 'translateY(-50%)', 
          backgroundColor: 'rgba(255,255,255,0.7)', 
          border: '1px solid #ddd',
          borderRadius: '50%', 
          width: '44px', 
          height: '44px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer',
          zIndex: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <ChevronLeft size={22} color="#000" />
      </button>

      {/* Slider Right Arrow */}
      <button 
        onClick={handleNext}
        style={{ 
          position: 'absolute', 
          top: '50%', 
          right: '20px', 
          transform: 'translateY(-50%)', 
          backgroundColor: 'rgba(255,255,255,0.7)', 
          border: '1px solid #ddd',
          borderRadius: '50%', 
          width: '44px', 
          height: '44px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer',
          zIndex: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <ChevronRight size={22} color="#000" />
      </button>

      {/* Dots Indicator list at bottom */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          display: 'flex', 
          gap: '0.6rem', 
          zIndex: 20 
        }}
      >
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: current === idx ? '#0f766e' : '#ccc',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          />
        ))}
      </div>

      <style>{`
        .explore-btn:hover {
          background-color: #000 !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}
