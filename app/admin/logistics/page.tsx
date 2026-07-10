import React from 'react';
import { Truck, Package, MapPin, AlertTriangle, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export default function LogisticsDashboard() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supply Chain & Delivery</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Courier & Logistics</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#111', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid #333', fontWeight: 600, cursor: 'pointer' }}>
            Manage Carriers
          </button>
          <button style={{ background: '#fde047', color: '#000', padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Truck size={18} /> Dispatch Batch
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <MetricCard title="In Transit" value="1,432" trend="On Schedule" icon={<Truck color="#3b82f6" />} type="info" />
        <MetricCard title="Pending Dispatch" value="348" trend="Needs Action" icon={<Package color="#fde047" />} type="warning" />
        <MetricCard title="Delivered (7d)" value="3,892" trend="98% Success" icon={<CheckCircle2 color="#4ade80" />} type="positive" />
        <MetricCard title="Exceptions/Delays" value="24" trend="Action Req." icon={<AlertTriangle color="#f87171" />} type="negative" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Active Shipments */}
        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Active Shipments</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Search Tracking ID..." style={{ background: '#0a0a0a', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '6px', color: '#fff' }} />
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#888', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
                <th style={{ paddingBottom: '1rem' }}>Tracking ID</th>
                <th style={{ paddingBottom: '1rem' }}>Destination</th>
                <th style={{ paddingBottom: '1rem' }}>Courier</th>
                <th style={{ paddingBottom: '1rem' }}>Status</th>
                <th style={{ paddingBottom: '1rem' }}>Est. Delivery</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'FDX-8932471', dest: 'New York, NY', courier: 'FedEx Express', status: 'Out for Delivery', date: 'Today', color: '#3b82f6' },
                { id: 'DHL-1198302', dest: 'London, UK', courier: 'DHL International', status: 'In Transit', date: 'Oct 24', color: '#fde047' },
                { id: 'UPS-5592100', dest: 'Los Angeles, CA', courier: 'UPS Ground', status: 'Delayed', date: 'Oct 26', color: '#f87171' },
                { id: 'USPS-992144', dest: 'Austin, TX', courier: 'USPS Priority', status: 'Delivered', date: 'Yesterday', color: '#4ade80' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem 0', fontWeight: 500, fontFamily: 'monospace', color: '#fff' }}>{row.id}</td>
                  <td style={{ padding: '1rem 0', color: '#ccc' }}>{row.dest}</td>
                  <td style={{ padding: '1rem 0', color: '#888' }}>{row.courier}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ color: row.color, background: `${row.color}15`, padding: '4px 10px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>{row.status}</span>
                  </td>
                  <td style={{ padding: '1rem 0', color: '#666', fontSize: '0.9rem' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dispatch Queue */}
        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Clock size={20} color="#888" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Dispatch Queue</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { batch: 'Batch #892', items: 45, time: 'Due in 2 hrs' },
              { batch: 'Batch #893', items: 112, time: 'Due in 5 hrs' },
              { batch: 'Batch #894', items: 28, time: 'Tomorrow 9 AM' },
              { batch: 'Custom Orders', items: 14, time: 'Pending QA' }
            ].map((queue, idx) => (
              <div key={idx} style={{ padding: '1rem', background: '#151515', borderRadius: '8px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{queue.batch}</h3>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>{queue.items} Orders</p>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#fde047', background: '#fde04715', padding: '4px 8px', borderRadius: '4px' }}>
                  {queue.time}
                </span>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', padding: '1rem', background: '#fff', color: '#000', borderRadius: '8px', border: 'none', fontWeight: 'bold', marginTop: '1.5rem', cursor: 'pointer' }}>
            Print All Labels
          </button>
        </div>
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
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: trendColor, background: `${trendColor}15`, padding: '2px 8px', borderRadius: '4px' }}>
          {trend}
        </span>
      </div>
      <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{title}</h3>
      <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
}
