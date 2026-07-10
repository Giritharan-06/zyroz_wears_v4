'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, ShoppingCart, Package, Palette, Users, BarChart,
  Settings as SettingsIcon, CreditCard, Truck, MessageSquare, Star,
  Briefcase, ChevronRight, Bell, Search, Menu, X, Store, ChevronDown,
  Globe, Shield, Share2, Tag
} from 'lucide-react';

interface NavSubItem {
  href: string;
  label: string;
  icon: any;
}

interface NavItem {
  href: string;
  icon: any;
  label: string;
  subItems?: NavSubItem[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', icon: Home, label: 'Dashboard' },
      { href: '/admin/analytics', icon: BarChart, label: 'Analytics' },
    ]
  },
  {
    label: 'Commerce',
    items: [
      { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
      { href: '/admin/products', icon: Package, label: 'Products' },
      { href: '/admin/designs', icon: Palette, label: 'Custom Designs' },
      { href: '/admin/vendors', icon: Store, label: 'Vendors' },
      { href: '/admin/reviews', icon: Star, label: 'Reviews' },
      { href: '/admin/discounts', icon: Tag, label: 'Discounts' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
      { href: '/admin/logistics', icon: Truck, label: 'Logistics' },
      { href: '/admin/support', icon: MessageSquare, label: 'Support' },
    ]
  },
  {
    label: 'Customers',
    items: [
      { href: '/admin/users', icon: Users, label: 'Customers' },
      { href: '/admin/crm', icon: Briefcase, label: 'CRM Hub' },
    ]
  },
  {
    label: 'System',
    items: [
      { 
        href: '/admin/settings', 
        icon: SettingsIcon, 
        label: 'Settings',
        subItems: [
          { href: '/admin/settings?tab=general', label: 'General', icon: Store },
          { href: '/admin/settings?tab=appearance', label: 'Appearance', icon: Palette },
          { href: '/admin/settings?tab=notifications', label: 'Notifications', icon: Bell },
          { href: '/admin/settings?tab=payments', label: 'Payments', icon: CreditCard },
          { href: '/admin/settings?tab=shipping', label: 'Shipping', icon: Truck },
          { href: '/admin/settings?tab=seo', label: 'SEO', icon: Globe },
          { href: '/admin/settings?tab=security', label: 'Security', icon: Shield },
          { href: '/admin/settings?tab=social', label: 'Social Media', icon: Share2 },
        ]
      },
    ]
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .admin-link {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem;
          border-radius: 8px; color: #888; transition: all 0.2s; text-decoration: none;
          font-size: 0.9rem; font-weight: 500; position: relative;
        }
        .admin-link:hover { background: #1a1a1a; color: #fff; }
        .admin-link.active { background: #1a1a1a; color: #fff; }
        .admin-link.active::before {
          content: ''; position: absolute; left: 0; top: 20%; height: 60%;
          width: 3px; background: #4ade80; border-radius: 0 3px 3px 0;
        }
        .admin-sidebar { 
          width: 240px; min-height: 100vh; background: #0a0a0a; border-right: 1px solid #1a1a1a;
          padding: 1.5rem 0.75rem; display: flex; flex-direction: column; flex-shrink: 0;
          position: sticky; top: 0; height: 100vh; overflow-y: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
        }
        .admin-sidebar::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        .admin-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 2rem; background: #0a0a0a; border-bottom: 1px solid #1a1a1a;
          position: sticky; top: 0; z-index: 10;
        }
        .admin-main { flex: 1; padding: 2.5rem 2rem; overflow-x: hidden; }
        .nav-group-label { 
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          color: #444; padding: 0 1rem; margin: 1.5rem 0 0.5rem;
        }
        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
          .admin-sidebar.open { display: flex; position: fixed; z-index: 200; width: 280px; }
          .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 199; }
          .mobile-overlay.open { display: block; }
          .menu-btn { display: block !important; }
          .admin-topbar { padding: 1rem; }
          .admin-main { padding: 1.5rem 1rem; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Brand */}
        <div style={{ padding: '0 1rem 1.5rem', borderBottom: '1px solid #1a1a1a', marginBottom: '0.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#000', fontSize: '0.85rem', fontWeight: 900 }}>Z</span>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Zyroz Admin</div>
              <div style={{ color: '#555', fontSize: '0.7rem' }}>Store Manager</div>
            </div>
          </Link>
        </div>

        {/* Nav Groups */}
        <nav style={{ flex: 1 }}>
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const [isOpen, setIsOpen] = useState(isActive);

                return (
                  <div key={item.href}>
                    <div style={{ position: 'relative' }}>
                      <Link 
                        href={hasSubItems ? '#' : item.href} 
                        className={`admin-link${isActive ? ' active' : ''}`} 
                        onClick={(e) => {
                          if (hasSubItems) {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                          } else {
                            setSidebarOpen(false);
                          }
                        }}
                        style={{ justifyContent: 'space-between' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <item.icon size={17} />
                          {item.label}
                        </div>
                        {hasSubItems && (
                          <ChevronDown 
                            size={14} 
                            style={{ 
                              transition: 'transform 0.2s', 
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' 
                            }} 
                          />
                        )}
                      </Link>
                    </div>

                    <AnimatePresence>
                      {hasSubItems && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', paddingLeft: '1.25rem' }}
                        >
                          {item.subItems?.map((sub) => (
                            <Link 
                              key={sub.href} 
                              href={sub.href} 
                              className="admin-link"
                              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <sub.icon size={14} />
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom: View Store */}
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1rem', marginTop: '1rem' }}>
          <Link href="/" target="_blank" className="admin-link" style={{ color: '#4ade80' }}>
            <ChevronRight size={17} />
            View Storefront
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} className="menu-btn">
              <Menu size={22} />
            </button>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#555" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Search..." style={{ background: '#111', border: '1px solid #222', padding: '0.5rem 1rem 0.5rem 2.2rem', borderRadius: '8px', color: '#fff', width: '220px', fontSize: '0.9rem', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ position: 'relative', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '0.5rem', color: '#fff', cursor: 'pointer' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: '#f87171', borderRadius: '50%' }} />
            </button>
            <div style={{ width: '34px', height: '34px', background: '#4ade80', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '0.85rem' }}>
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
