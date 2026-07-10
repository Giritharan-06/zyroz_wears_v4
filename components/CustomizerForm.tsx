'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shirt, Scissors, Box, Link as ChainLink, CheckCircle } from 'lucide-react';

const productTypes = [
  { id: 't-shirts', name: 'T-Shirt', icon: <Shirt size={20} /> },
  { id: 'shirts', name: 'Shirt', icon: <Scissors size={20} /> },
  { id: 'pants', name: 'Pants', icon: <Box size={20} /> },
  { id: 'chains', name: 'Chain', icon: <ChainLink size={20} /> }
] as const;

type ProductTypeId = typeof productTypes[number]['id'];

const customizableOptions: Record<ProductTypeId, Array<{ label: string; options: string[] }>> = {
  't-shirts': [
    { label: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { label: 'Fabric Weight', options: ['Lightweight', 'Medium', 'Heavyweight'] },
    { label: 'Neckline', options: ['Crew', 'V-Neck', 'Scoop'] },
    { label: 'Color', options: ['Black', 'White', 'Navy', 'Heather Grey', 'Custom'] }
  ],
  'shirts': [
    { label: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { label: 'Collar Type', options: ['Spread', 'Button-Down', 'Mandarin'] },
    { label: 'Fit Profile', options: ['Slim', 'Regular', 'Relaxed'] },
    { label: 'Fabric', options: ['Oxford', 'Linen', 'Poplin'] }
  ],
  'pants': [
    { label: 'Waist Size', options: ['28', '30', '32', '34', '36', '38'] },
    { label: 'Fit', options: ['Skinny', 'Slim', 'Straight', 'Relaxed'] },
    { label: 'Material', options: ['Denim', 'Chino', 'Tech Fabric'] },
    { label: 'Waist Style', options: ['Standard', 'Drawstring', 'Elastic'] }
  ],
  'chains': [
    { label: 'Length', options: ['18"', '20"', '22"', '24"'] },
    { label: 'Metal', options: ['Silver', 'Gold Plated', 'Solid Gold', 'Platinum'] },
    { label: 'Link Design', options: ['Cuban', 'Rope', 'Figaro', 'Tennis'] }
  ]
};

export default function CustomizerForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get('type');

  const [selectedType, setSelectedType] = useState<ProductTypeId>(() => {
    const type = searchParams.get('type');
    if (type && Object.keys(customizableOptions).includes(type)) {
      return type as ProductTypeId;
    }
    return 't-shirts';
  });
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(searchParams.get('success') === 'true');

  // Sync selectedType with URL param when it changes externally
  // Use initializer to derive from URL param, and update via state setter in callback
  const handleSelection = useCallback((category: string, option: string) => {
    setSelections(prev => ({ ...prev, [category]: option }));
  }, []);

  useState(() => {
    if (typeParam && Object.keys(customizableOptions).includes(typeParam)) {
      setSelectedType(typeParam as ProductTypeId);
    }
  });

  const currentOptions = customizableOptions[selectedType];

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111', borderRadius: '16px', border: '1px solid #333' }}>
        <CheckCircle size={64} color="#4ade80" style={{ margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>Design Request Received</h2>
        <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Our design team is reviewing your specifications and will get back to you shortly.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setSelections({}); router.push('/customize'); }}
          style={{ background: '#fff', color: '#000', padding: '1rem 2rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Customize Another Item
        </button>
      </div>
    );
  }

   return (
     <form action="/api/submit-design" method="POST" encType="multipart/form-data" style={{ width: '100%' }} onSubmit={(e) => { e.preventDefault(); setIsSubmitting(true); }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {productTypes.map(type => (
          <button
            key={type.id}
            type="button"
            onClick={() => { setSelectedType(type.id); setSelections({}); }}
            style={{
              padding: '1.5rem 1rem',
              background: selectedType === type.id ? '#fff' : '#111',
              color: selectedType === type.id ? '#000' : '#fff',
              border: `1px solid ${selectedType === type.id ? '#fff' : '#333'}`,
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: '600'
            }}
          >
            {type.icon}
            {type.name}
          </button>
        ))}
      </div>

      <input type="hidden" name="productType" value={selectedType} />

      <div style={{ background: '#111', padding: '2.5rem', borderRadius: '16px', border: '1px solid #222', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
          Customize Your {productTypes.find(t => t.id === selectedType)?.name}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {currentOptions.map((optGroup, idx) => (
            <div key={idx}>
              <label style={{ display: 'block', color: '#888', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                {optGroup.label}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {optGroup.options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelection(optGroup.label, opt)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: selections[optGroup.label] === opt ? '#3b82f6' : '#1a1a1a',
                      color: selections[optGroup.label] === opt ? '#fff' : '#aaa',
                      border: `1px solid ${selections[optGroup.label] === opt ? '#3b82f6' : '#333'}`,
                      borderRadius: '99px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              <input type="hidden" name={`opt_${optGroup.label.replace(/\s+/g, '_')}`} value={selections[optGroup.label] || ''} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#111', padding: '2.5rem', borderRadius: '16px', border: '1px solid #222', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Personal Details</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
            <input required type="text" id="name" name="name" style={{ padding: '1rem', backgroundColor: '#050505', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '1rem' }} placeholder="Your Name" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
            <input required type="email" id="email" name="email" style={{ padding: '1rem', backgroundColor: '#050505', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '1rem' }} placeholder="you@example.com" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="notes" style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600 }}>Additional Design Notes</label>
          <textarea id="notes" name="notes" rows={4} style={{ padding: '1rem', backgroundColor: '#050505', border: '1px solid #333', color: '#fff', borderRadius: '8px', resize: 'vertical', fontSize: '1rem' }} placeholder="Describe your custom text, graphics, specific colors, etc."></textarea>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600 }}>Upload Design Reference (Optional)</label>
          <div style={{
            border: '2px dashed #333', borderRadius: '12px', padding: '2rem', textAlign: 'center',
            background: '#050505', cursor: 'pointer', transition: 'all 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#4ade80'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}>
            <input type="file" id="designImage" name="designImage" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
              const fileName = e.target.files?.[0]?.name;
              if (fileName) {
                const label = document.getElementById('file-label');
                if (label) label.innerText = `Selected: ${fileName}`;
              }
            }} />
            <label htmlFor="designImage" id="file-label" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#555' }}>
              <Shirt size={32} />
              <span>Click to upload or drag and drop</span>
              <span style={{ fontSize: '0.75rem' }}>PNG, JPG or SVG (max. 5MB)</span>
            </label>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ 
          marginTop: '1rem',
          padding: '1.2rem', 
          backgroundColor: isSubmitting ? '#555' : '#fff', 
          color: isSubmitting ? '#aaa' : '#000', 
          border: 'none', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          borderRadius: '8px',
          fontSize: '1.1rem',
          transition: 'background 0.2s'
        }}>
          {isSubmitting ? 'Submitting...' : 'Submit Custom Design Request'}
        </button>
      </div>
    </form>
  );
}
