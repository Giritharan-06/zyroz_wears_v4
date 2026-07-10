'use client';
import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Store, Lock, Bell, CreditCard, Truck, Palette, Globe, Shield,
  Save, Check, Mail, Phone, MapPin, MessageSquare, Share2
} from 'lucide-react';

type Tab = 'general' | 'appearance' | 'notifications' | 'payments' | 'shipping' | 'seo' | 'security' | 'social';

const TABS: { id: Tab; label: string; icon: typeof Store }[] = [
  { id: 'general',       label: 'General',       icon: Store },
  { id: 'appearance',    label: 'Appearance',     icon: Palette },
  { id: 'notifications', label: 'Notifications',  icon: Bell },
  { id: 'payments',      label: 'Payments',       icon: CreditCard },
  { id: 'shipping',      label: 'Shipping',       icon: Truck },
  { id: 'seo',           label: 'SEO',            icon: Globe },
  { id: 'security',      label: 'Security',       icon: Shield },
  { id: 'social',        label: 'Social Media',   icon: Share2 },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem', fontWeight: 500, textTransform: 'none', letterSpacing: '0' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', background: '#0a0a0a',
  border: '1px solid #222', color: '#fff', borderRadius: '8px',
  fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s'
} as const;

const toggleStyle = (on: boolean) => ({
  width: '44px', height: '24px', borderRadius: '12px', background: on ? '#4ade80' : '#222',
  position: 'relative' as const, cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
} as const);

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div style={toggleStyle(on)} onClick={onToggle}>
      <div style={{
        position: 'absolute', top: '2px',
        left: on ? '22px' : '2px', width: '20px', height: '20px',
        borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.4)'
      }} />
    </div>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') as Tab;
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || 'general');
  const [saved, setSaved] = useState(false);

  const initialTabRef = useRef<Tab | null>(null);
  useEffect(() => {
    if (initialTabRef.current === null) {
      initialTabRef.current = tabParam || 'general';
    } else if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const [storeName, setStoreName] = useState('Zyroz Wears');
  const [storeEmail, setStoreEmail] = useState('hello@zyrozwears.com');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [storeAddress, setStoreAddress] = useState('Chennai, Tamil Nadu, India');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [primaryColor, setPrimaryColor] = useState('#4ade80');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [darkMode, setDarkMode] = useState(true);
  const [customFont, setCustomFont] = useState('Outfit');
  const [emailOrders, setEmailOrders] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(true);
  const [emailDesigns, setEmailDesigns] = useState(true);
  const [smsOrders, setSmsOrders] = useState(false);
  const [pushNotify, setPushNotify] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [codEnabled, setCodEnabled] = useState(true);
  const [freeShipping, setFreeShipping] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('99');
  const [expressShipping, setExpressShipping] = useState(true);
  const [internationalShipping, setInternationalShipping] = useState(true);
  const [defaultCarrier, setDefaultCarrier] = useState('FedEx');
  const [metaTitle, setMetaTitle] = useState('Zyroz Wears – Premium Custom Streetwear');
  const [metaDesc, setMetaDesc] = useState('Shop premium custom t-shirts, shirts, pants, and chains at Zyroz Wears. Fully customizable streetwear designed to match your style.');
  const [ogImage, setOgImage] = useState('');
  const [googleAnalytics, setGoogleAnalytics] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [loginNotify, setLoginNotify] = useState(true);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [instagram, setInstagram] = useState('@zyrozwears');
  const [twitter, setTwitter] = useState('@zyrozwears');
  const [facebook, setFacebook] = useState('zyrozwears');
  const [youtube, setYoutube] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Configuration</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Settings</h1>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleSave}>
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '2rem' }}>

            {activeTab === 'general' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>General Settings</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
                  <Field label="Store Name">
                    <input style={inputStyle} value={storeName} onChange={e => setStoreName(e.target.value)} />
                  </Field>
                  <Field label="Default Currency">
                    <select style={inputStyle} value={currency} onChange={e => setCurrency(e.target.value)}>
                      <option value="USD">USD – US Dollar</option>
                      <option value="INR">INR – Indian Rupee</option>
                      <option value="EUR">EUR – Euro</option>
                      <option value="GBP">GBP – British Pound</option>
                    </select>
                  </Field>
                  <Field label="Contact Email">
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="#555" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={storeEmail} onChange={e => setStoreEmail(e.target.value)} />
                    </div>
                  </Field>
                  <Field label="Support Phone">
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#555" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={supportPhone} onChange={e => setSupportPhone(e.target.value)} />
                    </div>
                  </Field>
                  <Field label="Language">
                    <select style={inputStyle} value={language} onChange={e => setLanguage(e.target.value)}>
                      <option value="en">English</option>
                      <option value="ta">Tamil</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </Field>
                  <Field label="Store Address">
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} color="#555" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={storeAddress} onChange={e => setStoreAddress(e.target.value)} />
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>Theme & Appearance</h2>
                <Field label="Primary Brand Color">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: '44px', height: '44px', padding: 0, border: '1px solid #333', borderRadius: '8px', background: 'transparent', cursor: 'pointer' }} />
                    <input style={{ ...inputStyle, width: '160px' }} value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} />
                    <span style={{ color: '#555', fontSize: '0.85rem' }}>Used for CTA buttons, highlights</span>
                  </div>
                </Field>
                <Field label="Accent Color">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} style={{ width: '44px', height: '44px', padding: 0, border: '1px solid #333', borderRadius: '8px', background: 'transparent', cursor: 'pointer' }} />
                    <input style={{ ...inputStyle, width: '160px' }} value={accentColor} onChange={e => setAccentColor(e.target.value)} />
                  </div>
                </Field>
                <Field label="Logo Upload">
                  <input type="file" accept="image/*" style={{ color: '#888', fontSize: '0.9rem' }} />
                </Field>
                <Field label="Store Font">
                  <select style={inputStyle} value={customFont} onChange={e => setCustomFont(e.target.value)}>
                    <option>Outfit</option>
                    <option>Inter</option>
                    <option>Poppins</option>
                    <option>Montserrat</option>
                    <option>Space Grotesk</option>
                  </select>
                </Field>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#111', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>Dark Mode (Admin)</p>
                    <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.2rem' }}>Admin panel background preference</p>
                  </div>
                  <Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>Notification Preferences</h2>
                <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Control when and how you receive alerts about your store activity.</p>
                {[
                  { label: 'New Order Email', sub: 'Receive an email for every new order placed', val: emailOrders, set: setEmailOrders },
                  { label: 'Marketing Emails', sub: 'Campaign summaries and performance reports', val: emailMarketing, set: setEmailMarketing },
                  { label: 'New Design Request', sub: 'Get notified when a custom design is submitted', val: emailDesigns, set: setEmailDesigns },
                  { label: 'SMS Order Alerts', sub: 'Receive SMS for critical order updates', val: smsOrders, set: setSmsOrders },
                  { label: 'Push Notifications', sub: 'Browser push for real-time alerts', val: pushNotify, set: setPushNotify },
                  { label: 'Low Stock Alerts', sub: 'Warn when product stock drops below 10 units', val: lowStockAlert, set: setLowStockAlert },
                ].map(n => (
                  <div key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #111' }}>
                    <div>
                      <p style={{ fontWeight: 500 }}>{n.label}</p>
                      <p style={{ color: '#555', fontSize: '0.83rem', marginTop: '0.2rem' }}>{n.sub}</p>
                    </div>
                    <Toggle on={n.val} onToggle={() => n.set(!n.val)} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>Payment Gateways</h2>
                  {[
                    { label: 'Stripe', sub: 'Credit/Debit cards, Apple Pay, Google Pay', val: stripeEnabled, set: setStripeEnabled },
                    { label: 'PayPal', sub: 'PayPal wallet & credit', val: paypalEnabled, set: setPaypalEnabled },
                    { label: 'Razorpay', sub: 'UPI, NetBanking, Wallets (India)', val: razorpayEnabled, set: setRazorpayEnabled },
                    { label: 'Cash on Delivery', sub: 'Available for domestic orders only', val: codEnabled, set: setCodEnabled },
                  ].map(p => (
                    <div key={p.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', background: '#111', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #1a1a1a' }}>
                      <div>
                        <p style={{ fontWeight: 600 }}>{p.label}</p>
                        <p style={{ color: '#555', fontSize: '0.83rem', marginTop: '0.2rem' }}>{p.sub}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: p.val ? '#4ade80' : '#555' }}>{p.val ? 'Active' : 'Disabled'}</span>
                        <Toggle on={p.val} onToggle={() => p.set(!p.val)} />
                      </div>
                    </div>
                  ))}
                  <Field label="Stripe API Key">
                    <input style={inputStyle} type="password" placeholder="sk_live_..." />
                  </Field>
                  <Field label="Stripe Publishable Key">
                    <input style={inputStyle} type="password" placeholder="pk_live_..." />
                  </Field>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>Shipping Configuration</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', background: '#111', borderRadius: '10px', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>Free Shipping</p>
                    <p style={{ color: '#555', fontSize: '0.83rem', marginTop: '0.2rem' }}>Offer free shipping above a cart threshold</p>
                  </div>
                  <Toggle on={freeShipping} onToggle={() => setFreeShipping(!freeShipping)} />
                </div>
                {freeShipping && (
                  <Field label="Free Shipping Threshold ($)">
                    <input style={inputStyle} type="number" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(e.target.value)} />
                  </Field>
                )}
                {[ 'Express Shipping', 'International Shipping' ].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', background: '#111', borderRadius: '10px', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{s}</p>
                      <p style={{ color: '#555', fontSize: '0.83rem', marginTop: '0.2rem' }}>{s === 'Express Shipping' ? 'FedEx, UPS Express options at checkout' : 'Ship to customers worldwide'}</p>
                    </div>
                    <Toggle on={s === 'Express Shipping' ? expressShipping : internationalShipping} onToggle={() => s === 'Express Shipping' ? setExpressShipping(!expressShipping) : setInternationalShipping(!internationalShipping)} />
                  </div>
                ))}
                <Field label="Default Carrier">
                  <select style={inputStyle} value={defaultCarrier} onChange={e => setDefaultCarrier(e.target.value)}>
                    <option>FedEx</option><option>DHL</option><option>UPS</option><option>USPS</option><option>BlueDart</option>
                  </select>
                </Field>
              </div>
            )}

            {activeTab === 'seo' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>SEO & Discoverability</h2>
                <Field label="Meta Title">
                  <input style={inputStyle} value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
                  <p style={{ color: '#555', fontSize: '0.78rem', marginTop: '0.4rem' }}>{metaTitle.length}/60 characters</p>
                </Field>
                <Field label="Meta Description">
                  <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={metaDesc} onChange={e => setMetaDesc(e.target.value)} />
                  <p style={{ color: '#555', fontSize: '0.78rem', marginTop: '0.4rem' }}>{metaDesc.length}/160 characters</p>
                </Field>
                <Field label="OG Image URL (Social Preview)">
                  <input style={inputStyle} placeholder="https://zyrozwears.com/og-image.jpg" value={ogImage} onChange={e => setOgImage(e.target.value)} />
                </Field>
                <Field label="Google Analytics Measurement ID">
                  <input style={inputStyle} placeholder="G-XXXXXXXXXX" value={googleAnalytics} onChange={e => setGoogleAnalytics(e.target.value)} />
                </Field>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>Security Settings</h2>
                {[ 'Two-Factor Authentication', 'Login Notifications' ].map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', background: '#111', borderRadius: '10px', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{s}</p>
                      <p style={{ color: '#555', fontSize: '0.83rem', marginTop: '0.2rem' }}>{['Require OTP on admin login', 'Email alert on new admin sign-in'][i]}</p>
                    </div>
                    <Toggle on={i === 0 ? twoFA : loginNotify} onToggle={() => i === 0 ? setTwoFA(!twoFA) : setLoginNotify(!loginNotify)} />
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1a1a1a' }}>
                  <h3 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Change Password</h3>
                  <Field label="Current Password"><input style={inputStyle} type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••" /></Field>
                  <Field label="New Password"><input style={inputStyle} type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" /></Field>
                  <Field label="Confirm New Password"><input style={inputStyle} type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••" /></Field>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>Social Media Links</h2>
                <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' }}>These links will appear in the website footer and help with SEO.</p>
                {[ { label: 'Instagram', icon: Share2, color: '#e1306c', val: instagram, set: setInstagram, placeholder: '@yourhandle' },
                   { label: 'Twitter / X', icon: Share2, color: '#1da1f2', val: twitter, set: setTwitter, placeholder: '@yourhandle' },
                   { label: 'Facebook', icon: Share2, color: '#1877f2', val: facebook, set: setFacebook, placeholder: 'facebook.com/page' },
                   { label: 'YouTube', icon: Globe, color: '#ff0000', val: youtube, set: setYoutube, placeholder: 'youtube.com/channel' },
                ].map(s => (
                  <Field key={s.label} label={s.label}>
                    <div style={{ position: 'relative' }}>
                      <s.icon size={16} color={s.color} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={s.val} onChange={e => s.set(e.target.value)} placeholder={s.placeholder} />
                    </div>
                  </Field>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1a1a1a' }}>
              <button type="submit" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: saved ? '#4ade80' : '#4ade80', color: '#000',
                padding: '0.8rem 2rem', borderRadius: '8px', border: 'none',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s'
              }}>
                {saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}