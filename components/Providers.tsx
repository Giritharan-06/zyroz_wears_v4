'use client';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import CartSidebar from './CartSidebar';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartSidebar />
      </CartProvider>
    </AuthProvider>
  );
}
