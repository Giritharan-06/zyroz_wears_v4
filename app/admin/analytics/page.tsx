export default function AnalyticsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Analytics & Reports</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
          <h3 style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Overall Conversion Rate</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>4.8%</p>
          <p style={{ color: '#4ade80', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>+0.5% from last month</p>
        </div>
        
        <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
          <h3 style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Average Order Value</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>$84.50</p>
          <p style={{ color: '#f87171', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>-2.1% from last month</p>
        </div>
        
        <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
          <h3 style={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Returning Customer Rate</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>32.4%</p>
          <p style={{ color: '#4ade80', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>+4.2% from last month</p>
        </div>
      </div>
      
      <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#888', marginBottom: '1rem' }}>Detailed charts and graphs would go here.</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '150px', borderBottom: '1px solid #333', paddingBottom: '1rem', width: '80%' }}>
          {[30, 50, 40, 70, 90, 60, 80, 100, 75, 45, 65, 85].map((height, i) => (
            <div key={i} style={{ flex: 1, backgroundColor: '#4ade80', height: `${height}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
