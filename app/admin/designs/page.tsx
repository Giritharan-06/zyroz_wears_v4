import { query } from '@/lib/db';

export default async function AdminDesignsPage() {
  let designs: any[] = [];
  
  try {
    const res = await query('SELECT * FROM custom_designs ORDER BY created_at DESC');
    if (res && res.rows) {
      designs = res.rows;
    }
  } catch (err) {
    console.error("Failed to fetch designs:", err);
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Custom Design Requests</h1>
      
      {designs.length === 0 ? (
        <p style={{ color: '#888' }}>No custom design requests yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {designs.map((design: any) => (
            <div key={design.id} style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #222' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>{design.customer_name}</h3>
              <a href={`mailto:${design.email}`} style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '1.5rem' }}>
                {design.email}
              </a>
              
              <div style={{ backgroundColor: '#050505', padding: '1rem', borderRadius: '4px', border: '1px solid #222' }}>
                <p style={{ color: '#ddd', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {design.design_notes}
                </p>
              </div>

              {design.image_url && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Design Reference</p>
                  <a href={design.image_url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={design.image_url} 
                      alt="Design Reference" 
                      className="design-ref-img"
                      style={{ 
                        width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #222',
                        cursor: 'zoom-in'
                      }} 
                    />
                  </a>
                </div>
              )}
              
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  className="mark-read-btn"
                  style={{ background: '#4ade80', color: '#000', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Mark as Read
                </button>
                <span style={{ fontSize: '0.8rem', color: '#555' }}>
                  {new Date(design.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .design-ref-img { transition: opacity 0.2s; }
        .design-ref-img:hover { opacity: 0.8; }
        .mark-read-btn { transition: transform 0.2s; }
        .mark-read-btn:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
