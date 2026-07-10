import React from 'react';
import { MessageSquare, Clock, Inbox, ShieldAlert, CheckCircle, Search } from 'lucide-react';

export default function SupportDashboard() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Service</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Support Tickets</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search tickets..." style={{ background: '#111', border: '1px solid #333', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', color: '#fff', width: '250px' }} />
          </div>
          <button style={{ background: '#4ade80', color: '#000', padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            New Ticket
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <MetricCard title="Unresolved Tickets" value="48" trend="+12" icon={<Inbox color="#3b82f6" />} type="info" />
        <MetricCard title="Avg. Response Time" value="1.2h" trend="-15m" icon={<Clock color="#4ade80" />} type="positive" />
        <MetricCard title="Escalations" value="5" trend="+2" icon={<ShieldAlert color="#f87171" />} type="negative" />
        <MetricCard title="CSAT Score" value="4.8/5" trend="+0.2" icon={<CheckCircle color="#fde047" />} type="warning" />
      </div>

      <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 600, borderBottom: '2px solid #4ade80', paddingBottom: '1rem', marginBottom: '-1rem', cursor: 'pointer' }}>Requires Action (12)</button>
          <button style={{ background: 'none', border: 'none', color: '#888', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}>Pending Customer (36)</button>
          <button style={{ background: 'none', border: 'none', color: '#888', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}>Resolved (1,204)</button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: '#888', fontSize: '0.9rem' }}>
              <th style={{ padding: '1rem 0' }}>Ticket Info</th>
              <th style={{ padding: '1rem 0' }}>Customer</th>
              <th style={{ padding: '1rem 0' }}>Priority</th>
              <th style={{ padding: '1rem 0' }}>Status</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: '#TCK-9021', subject: 'Defective zipper on jacket', customer: 'Alex Johnson', priority: 'High', status: 'Open', time: '10 mins ago', color: '#f87171' },
              { id: '#TCK-9020', subject: 'Return request for Order #1234', customer: 'Maria Garcia', priority: 'Medium', status: 'Open', time: '1 hour ago', color: '#fde047' },
              { id: '#TCK-9018', subject: 'Custom design consultation', customer: 'David Smith', priority: 'Medium', status: 'In Progress', time: '3 hours ago', color: '#3b82f6' },
              { id: '#TCK-9015', subject: 'Where is my tracking number?', customer: 'Emma Wilson', priority: 'Low', status: 'Open', time: '5 hours ago', color: '#888' },
              { id: '#TCK-9011', subject: 'Exchange size from M to L', customer: 'James Lee', priority: 'Medium', status: 'Open', time: 'Yesterday', color: '#fde047' },
            ].map((row, i) => (
              <tr key={i} style={{ borderTop: '1px solid #222', transition: 'background 0.2s', cursor: 'pointer' }}>
                <td style={{ padding: '1.5rem 0' }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.3rem' }}>{row.subject}</div>
                  <div style={{ color: '#666', fontSize: '0.85rem', fontFamily: 'monospace' }}>{row.id}</div>
                </td>
                <td style={{ padding: '1.5rem 0', color: '#ccc' }}>{row.customer}</td>
                <td style={{ padding: '1.5rem 0' }}>
                  <span style={{ color: row.color, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: row.color }}></div>
                    {row.priority}
                  </span>
                </td>
                <td style={{ padding: '1.5rem 0' }}>
                  <span style={{ color: '#fff', background: '#222', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>{row.status}</span>
                </td>
                <td style={{ padding: '1.5rem 0', textAlign: 'right', color: '#888', fontSize: '0.9rem' }}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, type }: any) {
  const trendColor = type === 'positive' ? '#4ade80' : type === 'negative' ? '#f87171' : type === 'warning' ? '#fde047' : '#3b82f6';
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
