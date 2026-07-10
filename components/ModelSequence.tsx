'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface ModelSequenceProps {
  images: string[];
}

export default function ModelSequence({ images }: ModelSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Keep a ref of loadedImages to avoid stale closure in event handler
  const loadedImagesRef = useRef(loadedImages);
  const initCalledRef = useRef(false);
  
  // Use effect to keep ref updated without triggering re-renders
  useEffect(() => {
    loadedImagesRef.current = loadedImages;
  }, [loadedImages]);

  // drawImageScaled must be defined BEFORE any useEffects/useMotionValueEvent that call it
  const drawImageScaled = useCallback((img: HTMLImageElement, ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement) => {
    if (!ctx) return;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio) * 0.8;

    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.drawImage(img, 0, 0, img.width, img.height,
                  centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  }, []);

  // Preload all images and draw the FIRST frame IMMEDIATELY
  // Use a ref init flag so this runs only once on mount
  useEffect(() => {
    if (images.length === 0 || initCalledRef.current) return;
    initCalledRef.current = true;

    // First, draw the first image immediately so there is no empty space
    const initialImg = new Image();
    initialImg.src = images[0];
    initialImg.onload = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawImageScaled(initialImg, ctx, canvasRef.current);
      }
    };

    // Preload remaining images in background
    const promises = images.map((src) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(promises).then((loaded) => {
      setLoadedImages(loaded);
    }).catch(console.error);
  }, [images, drawImageScaled]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const currentImages = loadedImagesRef.current;
    if (currentImages.length === 0 || !canvasRef.current) return;
    const frameIndex = Math.min(
      Math.floor(latest * currentImages.length),
      currentImages.length - 1
    );
    const ctx = canvasRef.current.getContext('2d');

    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawImageScaled(currentImages[frameIndex], ctx, canvasRef.current);
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && loadedImages.length > 0) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const currentFrameIndex = Math.min(
          Math.floor(scrollYProgress.get() * loadedImages.length),
          loadedImages.length - 1
        );
        const ctx = canvasRef.current.getContext('2d');
        drawImageScaled(loadedImages[currentFrameIndex], ctx, canvasRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadedImages, scrollYProgress, drawImageScaled]);

  // Hero Title Animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  // Intermediate Text Animation (Halfway down)
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.4, 0.6], [50, -50]);

  return (
    <section id="custom" ref={sectionRef} className="interactive-sequence" style={{ position: 'relative' }}>
      <div className="sequence-sticky" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* The rotating T-shirt sequence */}
        <canvas ref={canvasRef} className="sequence-canvas" style={{ width: '100vw', height: '100vh', objectFit: 'contain' }} />
        
        {/* Hero Overlay Container */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          
          {/* Main Hero Header Text */}
          <motion.div 
            style={{ 
              opacity: heroOpacity, 
              y: heroY, 
              scale: heroScale,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mixBlendMode: 'difference',
              color: '#fff',
              position: 'absolute'
            }}
          >
            <h1 style={{ fontSize: 'clamp(4rem, 15vw, 12rem)', lineHeight: '0.85', textTransform: 'uppercase', fontWeight: 800 }}>
              ZYROZ
            </h1>
            <p style={{ fontSize: '1.2rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1rem', color: '#ccc' }}>
              Wear Your Identity
            </p>
            <p style={{ marginTop: '0.5rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Custom Premium Wear
            </p>
          </motion.div>

          {/* Subtitle that appears as you scroll down */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              opacity: textOpacity, 
              y: textY,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              mixBlendMode: 'difference'
            }}
          >
            <h2 style={{ fontSize: '4rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Fully Customizable
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', letterSpacing: '0.1em' }}>
              Make it yours. Premium Streetwear.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
