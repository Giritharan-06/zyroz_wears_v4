'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

interface Props {
  item: {
    id: string | number;
    name: string;
    price: number;
    image: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

export default function AddToCartButton({ item, className, style }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(item)}
      className={className}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        fontWeight: 600,
        textTransform: 'uppercase',
        cursor: 'pointer',
        ...style
      }}
    >
      Add to Cart
    </button>
  );
}
