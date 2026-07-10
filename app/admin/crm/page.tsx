import React from 'react';
import { Users, UserPlus, Activity, Target, Mail } from 'lucide-react';

export default function CRMDashboard() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Relationship Management</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>CRM Hub</h1>
        </div>
        <button style={{ background: '#fff', color: '#000', padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          + New Campaign
        </button>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <MetricCard title="Total Customers" value="8,402" trend="+12%" icon={<Users color="#3b82f6" />} />
        <MetricCard title="New Leads" value="342" trend="+5%" icon={<UserPlus color="#4ade80" />} />
        <MetricCard title="Retention Rate" value="76%" trend="-2%" icon={<Activity color="#fde047" />} />
        <MetricCard title="Avg. Customer Value" value="$420" trend="+8%" icon={<Target color="#a78bfa" />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Interactions */}
        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Customer Interactions</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#888', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
                <th style={{ paddingBottom: '1rem' }}>Customer</th>
                <th style={{ paddingBottom: '1rem' }}>Interaction</th>
                <th style={{ paddingBottom: '1rem' }}>Status</th>
                <th style={{ paddingBottom: '1rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sarah Jenkins', type: 'Design Consultation', status: 'Pending', date: '2 hours ago', color: '#fde047' },
                { name: 'Michael Chen', type: 'VIP Support Ticket', status: 'Resolved', date: '5 hours ago', color: '#4ade80' },
                { name: 'Emma Wilson', type: 'Abandoned Cart', status: 'Followed Up', date: '1 day ago', color: '#3b82f6' },
                { name: 'David Smith', type: 'Product Inquiry', status: 'Open', date: '1 day ago', color: '#f87171' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: '1rem 0', color: '#ccc' }}>{row.type}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ color: row.color, background: `${row.color}15`, padding: '4px 10px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>{row.status}</span>
                  </td>
                  <td style={{ padding: '1rem 0', color: '#666', fontSize: '0.9rem' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Active Campaigns */}
        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Mail size={20} color="#888" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Active Campaigns</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { title: 'Summer Collection Launch', sent: '12,000', openRate: '45%', clickRate: '12%' },
              { title: 'VIP Exclusive Chains', sent: '1,500', openRate: '68%', clickRate: '34%' },
              { title: 'Cart Abandonment Drip', sent: 'Auto', openRate: '55%', clickRate: '18%' }
            ].map((camp, idx) => (
              <div key={idx} style={{ paddingBottom: '1.5rem', borderBottom: idx !== 2 ? '1px solid #222' : 'none' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{camp.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.85rem' }}>
                  <span>Sent: {camp.sent}</span>
                  <span>Open: <span style={{ color: '#fff' }}>{camp.openRate}</span></span>
                  <span>Click: <span style={{ color: '#4ade80' }}>{camp.clickRate}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon }: any) {
  return (
    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ background: '#1a1a1a', padding: '10px', borderRadius: '8px' }}>
          {icon}
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: trend.startsWith('+') ? '#4ade80' : '#f87171' }}>
          {trend}
        </span>
      </div>
      <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{title}</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
}
