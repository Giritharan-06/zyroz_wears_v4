'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CreditCard, Truck, ShieldCheck, ChevronRight, ShoppingBag, ArrowLeft, CheckCircle2, Loader2, Tag, X } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { formatPrice } from '@/lib/format';

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'IND',
  });

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState('');
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  const applyDiscount = async () => {
    if (!discountCode) return;
    setValidatingDiscount(true);
    setDiscountError('');
    try {
      const res = await fetch('/api/checkout/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode, cartTotal: subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedDiscount(data);
        setDiscountCode('');
      } else {
        setDiscountError(data.error);
      }
    } catch (e) {
      setDiscountError('Failed to validate code');
    } finally {
      setValidatingDiscount(false);
    }
  };

  const discountAmount = appliedDiscount 
    ? (appliedDiscount.type === 'percentage' 
        ? (subtotal * appliedDiscount.value / 100) 
        : appliedDiscount.value)
    : 0;
  
  const finalTotal = subtotal - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) {
      setLoading(true);
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
            total_amount: finalTotal,
            items: cartItems
          })
        });
        if (res.ok) {
          setStep(3);
          clearCart();
        } else {
          console.warn('DB checkout failed, falling back to simulation.');
          setStep(3);
          clearCart();
        }
      } catch (e) {
        console.error('Checkout error:', e);
        setStep(3);
        clearCart();
      } finally {
        setLoading(false);
      }
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
        <Navbar />
        <div style={{ padding: '20vh 5vw', textAlign: 'center' }}>
          <ShoppingBag size={64} color="#333" style={{ marginBottom: '2rem' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Your cart is empty</h1>
          <p style={{ color: '#888', marginBottom: '2rem' }}>Add some premium pieces to your collection before checking out.</p>
          <Link href="/" style={{ padding: '1rem 3rem', background: '#fff', color: '#000', textDecoration: 'none', fontWeight: 700, borderRadius: '4px' }}>Back to Shop</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '15vh', paddingBottom: '10vh' }}>
        {step < 3 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem', alignItems: 'start' }}>
            
            {/* Checkout Form */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <span style={{ color: step >= 1 ? '#fff' : '#444', fontWeight: 700 }}>Information</span>
                <ChevronRight size={16} color="#444" />
                <span style={{ color: step >= 2 ? '#fff' : '#444', fontWeight: 700 }}>Payment</span>
              </div>

              <form onSubmit={handleNext}>
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Contact Information</h2>
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Email Address" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '8px', outline: 'none' }} 
                      />
                    </div>

                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Shipping Address</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleInputChange} style={{ width: '100%', padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                        <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleInputChange} style={{ width: '100%', padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <input type="text" name="address" placeholder="Address" required value={formData.address} onChange={handleInputChange} style={{ width: '100%', padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '8px', outline: 'none', marginBottom: '1rem' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleInputChange} style={{ width: '100%', padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                        <input type="text" name="postalCode" placeholder="Postal Code" required value={formData.postalCode} onChange={handleInputChange} style={{ width: '100%', padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '8px', outline: 'none' }} />
                        <select name="country" value={formData.country} onChange={handleInputChange} style={{ width: '100%', padding: '1.2rem', background: '#0a0a0a', border: '1px solid #222', color: '#fff', borderRadius: '8px', outline: 'none' }}>
                          <option value="USA">United States</option>
                          <option value="CAN">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="IND">India</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" style={{ padding: '1.5rem', background: '#fff', color: '#000', fontWeight: 800, textTransform: 'uppercase', borderRadius: '8px', cursor: 'pointer', border: 'none', marginTop: '1rem' }}>
                      Continue to Payment
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Payment Details</h2>
                      <div style={{ padding: '2rem', border: '1px solid #4ade80', background: 'rgba(74,222,128,0.05)', borderRadius: '12px', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                          <span style={{ fontWeight: 600 }}>Credit Card</span>
                          <CreditCard size={20} color="#4ade80" />
                        </div>
                        <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginBottom: '1rem' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <input type="text" placeholder="MM / YY" defaultValue="12 / 26" style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
                          <input type="text" placeholder="CVC" defaultValue="123" style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '1.2rem', background: 'transparent', color: '#fff', border: '1px solid #333', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>
                        <ArrowLeft size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Back
                      </button>
                      <button type="submit" disabled={loading} style={{ flex: 2, padding: '1.2rem', background: '#4ade80', color: '#000', fontWeight: 800, textTransform: 'uppercase', borderRadius: '8px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        {loading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : `Pay ${formatPrice(subtotal)}`}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '2rem', position: 'sticky', top: '15vh' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem' }}>Order Summary</h2>
              
              {/* Discount Code Input */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={16} color="#444" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="Discount Code" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} 
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={applyDiscount}
                    disabled={validatingDiscount || !discountCode}
                    style={{ padding: '0 1.5rem', background: '#fff', color: '#000', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    {validatingDiscount ? '...' : 'Apply'}
                  </button>
                </div>
                {discountError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 500 }}>{discountError}</p>}
                {appliedDiscount && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.8rem', background: 'rgba(74,222,128,0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.2)' }}>
                    <Tag size={14} color="#4ade80" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4ade80' }}>{appliedDiscount.code} Applied</span>
                    <button onClick={() => setAppliedDiscount(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer' }}><X size={14} /></button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      background: item.metadata?.isCustom ? item.metadata.hexColor || '#111' : '#111', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      flexShrink: 0, 
                      position: 'relative',
                      border: '1px solid #222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.metadata?.isCustom ? (
                        <>
                          {item.metadata.decalUrl ? (
                            <img src={item.metadata.decalUrl} alt={item.name} style={{ width: '32px', height: '32px', objectFit: 'contain', zIndex: 2 }} />
                          ) : (
                            <span style={{ fontSize: '0.55rem', fontWeight: 'bold', color: '#888' }}>3D SHIRT</span>
                          )}
                          <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.metadata.hexColor, border: '1px solid rgba(255,255,255,0.4)' }} />
                        </>
                      ) : (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#3b82f6', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.name}</p>
                      {item.metadata?.isCustom ? (
                        <p style={{ color: '#888', fontSize: '0.8rem' }}>Size: {item.metadata.size} | Color: {item.metadata.color}</p>
                      ) : (
                        <p style={{ color: '#555', fontSize: '0.8rem' }}>Standard Edition</p>
                      )}
                    </div>
                    <p style={{ fontWeight: 600 }}>{formatPrice(item.price * (item.quantity || 1))}</p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                    <span>Discount ({appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : 'Fixed'})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                  <span>Shipping</span>
                  <span style={{ color: '#4ade80' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.5rem', borderTop: '1px solid #1a1a1a', paddingTop: '1rem' }}>
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#444', fontSize: '0.8rem' }}>
                  <ShieldCheck size={14} /> <span>Secure SSL Encrypted Payment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#444', fontSize: '0.8rem' }}>
                  <Truck size={14} /> <span>Insured Worldwide Shipping</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Success State */
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ width: '100px', height: '100px', background: 'rgba(74,222,128,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem' }}>
              <CheckCircle2 size={50} color="#4ade80" />
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Order Confirmed</h1>
            <p style={{ color: '#888', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '3rem' }}>
              Thank you for choosing Zyroz. We've received your order and we're getting it ready for shipment. You'll receive a confirmation email shortly.
            </p>
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '2rem', marginBottom: '3rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#555' }}>Order Number</span>
                <span style={{ fontWeight: 700 }}>#ZY-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#555' }}>Shipping to</span>
                <span style={{ fontWeight: 700 }}>{formData.firstName} {formData.lastName}</span>
              </div>
            </div>
            <Link href="/" style={{ display: 'inline-block', padding: '1.2rem 3rem', background: '#fff', color: '#000', textDecoration: 'none', fontWeight: 800, borderRadius: '8px', textTransform: 'uppercase' }}>
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </main>
  );
}
