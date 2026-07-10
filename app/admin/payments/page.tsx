import React from 'react';
import { CreditCard, DollarSign, Activity, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';

export default function PaymentsDashboard() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial Operations</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Payments Gateway</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#111', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid #333', fontWeight: 600, cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <RefreshCcw size={16} /> Sync Stripe
          </button>
          <button style={{ background: '#3b82f6', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Generate Report
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <MetricCard title="Net Volume (30d)" value="$142,500" trend="+15%" icon={<DollarSign color="#4ade80" />} type="positive" />
        <MetricCard title="Successful Payments" value="1,245" trend="+8%" icon={<CreditCard color="#3b82f6" />} type="positive" />
        <MetricCard title="Refunds & Disputes" value="$1,240" trend="-2%" icon={<ArrowDownRight color="#f87171" />} type="negative" />
        <MetricCard title="Pending Payouts" value="$24,800" trend="Processing" icon={<Activity color="#fde047" />} type="neutral" />
      </div>

      <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Recent Transactions</h2>
          <select style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '6px' }}>
            <option>All Transactions</option>
            <option>Succeeded</option>
            <option>Refunded</option>
          </select>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: '#888', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
              <th style={{ paddingBottom: '1rem' }}>Transaction ID</th>
              <th style={{ paddingBottom: '1rem' }}>Amount</th>
              <th style={{ paddingBottom: '1rem' }}>Status</th>
              <th style={{ paddingBottom: '1rem' }}>Method</th>
              <th style={{ paddingBottom: '1rem' }}>Date</th>
              <th style={{ paddingBottom: '1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'ch_3M4Xv', amount: '$420.00', status: 'Succeeded', method: 'Visa •••• 4242', date: '10 mins ago', color: '#4ade80' },
              { id: 'ch_9J2Kl', amount: '$150.00', status: 'Succeeded', method: 'Apple Pay', date: '45 mins ago', color: '#4ade80' },
              { id: 'ch_1P8Zx', amount: '$85.00', status: 'Refunded', method: 'Mastercard •••• 5555', date: '2 hours ago', color: '#f87171' },
              { id: 'ch_5T2Mn', amount: '$1,200.00', status: 'Processing', method: 'Bank Transfer', date: '3 hours ago', color: '#fde047' },
              { id: 'ch_8A1Bc', amount: '$210.00', status: 'Succeeded', method: 'Visa •••• 1234', date: '5 hours ago', color: '#4ade80' },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500, fontFamily: 'monospace' }}>{row.id}</td>
                <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{row.amount}</td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ color: row.color, background: `${row.color}15`, padding: '4px 10px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>{row.status}</span>
                </td>
                <td style={{ padding: '1rem 0', color: '#aaa' }}>{row.method}</td>
                <td style={{ padding: '1rem 0', color: '#666', fontSize: '0.9rem' }}>{row.date}</td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><ArrowUpRight size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, type }: any) {
  const trendColor = type === 'positive' ? '#4ade80' : type === 'negative' ? '#f87171' : '#fde047';
  return (
    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '8px' }}>
          {icon}
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: trendColor }}>
          {trend}
        </span>
      </div>
      <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{title}</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
}
