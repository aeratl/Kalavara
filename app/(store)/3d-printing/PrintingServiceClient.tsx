'use client';

import { useState } from 'react';
import Link from 'next/link';

const WHATSAPP_NUMBER_1 = '919400634966';
const WHATSAPP_NUMBER_2 = '919567588028';

const PRINT_TYPES = [
  {
    id: 'fdm',
    name: 'FDM Printing',
    subtitle: 'Fused Deposition Modeling',
    price: 6,
    unit: 'gram',
    icon: '🖨️',
    color: '#1565c0',
    bg: 'linear-gradient(135deg, #001a3a, #003080)',
    accent: '#90caf9',
    features: [
      'Best for functional parts & prototypes',
      'Wide range of filament materials (PLA, PETG, ABS)',
      'Layer resolution: 0.1mm – 0.4mm',
      'Ideal for medium to large objects',
      'Faster turnaround time',
    ],
    usecases: ['Enclosures & housings', 'Mechanical parts', 'Display models', 'Jigs & fixtures'],
  },
  {
    id: 'sla',
    name: 'SLA Printing',
    subtitle: 'Stereolithography',
    price: 12,
    unit: 'gram',
    icon: '💠',
    color: '#6a1b9a',
    bg: 'linear-gradient(135deg, #1a003a, #4a0080)',
    accent: '#ce93d8',
    features: [
      'Ultra-high detail & smooth surfaces',
      'Layer resolution: 0.025mm – 0.1mm',
      'Premium resin materials',
      'Ideal for miniatures, jewelry, dental models',
      'Professional finish quality',
    ],
    usecases: ['Miniatures & figurines', 'Jewelry casting', 'Dental & medical', 'Artistic pieces'],
  },
];

function estimateWeight(size: string): string {
  const s = size.toLowerCase();
  if (s.includes('small') || s.includes('mini')) return '50–150';
  if (s.includes('medium') || s.includes('mid')) return '150–400';
  if (s.includes('large') || s.includes('big')) return '400–1000';
  return '100–500';
}

export default function PrintingServiceClient() {
  const [selected, setSelected] = useState<'fdm' | 'sla'>('fdm');
  const [form, setForm] = useState({
    name: '',
    productDescription: '',
    dimensions: '',
    color: '',
    quantity: '1',
    referenceLink: '',
    notes: '',
  });
  const [showEstimate, setShowEstimate] = useState(false);

  const selectedType = PRINT_TYPES.find((t) => t.id === selected)!;

  const buildWhatsAppMessage = () => {
    const weight = estimateWeight(form.dimensions);
    const minCost = parseInt(weight.split('–')[0]) * selectedType.price * parseInt(form.quantity || '1');
    const maxCost = parseInt(weight.split('–')[1] || weight.split('–')[0]) * selectedType.price * parseInt(form.quantity || '1');

    const msg = `🖨️ *3D Printing Order — Ee Kalavara*

*Customer:* ${form.name}
*Print Type:* ${selectedType.name} (₹${selectedType.price}/gram)
*Quantity:* ${form.quantity}

*Product Description:*
${form.productDescription}

*Dimensions / Size:* ${form.dimensions || 'Not specified'}
*Preferred Color:* ${form.color || 'Default / Any'}
${form.referenceLink ? `*Reference Link:* ${form.referenceLink}` : ''}
${form.notes ? `*Additional Notes:* ${form.notes}` : ''}

---
📊 *Estimated Cost:* ₹${minCost} – ₹${maxCost} + delivery
(Final price confirmed after reviewing your model)

Please share your 3D model file (STL/OBJ) or design reference so we can give you an exact quote! 🙏`;

    return encodeURIComponent(msg);
  };

  const handleSendToWhatsApp = (number: string) => {
    if (!form.name.trim() || !form.productDescription.trim()) return;
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendToWhatsApp(WHATSAPP_NUMBER_1);
  };

  const isValid = form.name.trim() && form.productDescription.trim();

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
        padding: '5rem 0 4rem',
        borderBottom: '1px solid #222',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <div className="container-page" style={{ maxWidth: '700px', position: 'relative' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#aaa',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0.35rem 0.85rem',
            borderRadius: '100px',
            marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '1rem' }}>🖨️</span>
            New Service
          </span>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            3D Printing,<br />
            <span style={{ color: '#666' }}>On Demand in Kerala</span>
          </h1>

          <p style={{
            fontSize: '1.0625rem',
            color: '#888',
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}>
            From functional prototypes to artistic masterpieces — we print it all.
            Choose your technology, describe your product, and we&apos;ll contact you on WhatsApp.
          </p>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'FDM', value: '₹6/gram', icon: '🖨️' },
              { label: 'SLA', value: '₹12/gram', icon: '💠' },
              { label: 'Delivery', value: 'All Kerala', icon: '🚚' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.125rem' }}>{s.label}</p>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ddd', margin: 0 }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container-page">
          <div className="section-header">
            <h2 className="section-title">Pricing</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>+ Delivery fee applicable</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {PRINT_TYPES.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelected(type.id as 'fdm' | 'sla')}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: selected === type.id ? `2px solid ${type.color}` : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: selected === type.id ? 'translateY(-2px)' : 'none',
                  boxShadow: selected === type.id ? `0 8px 24px ${type.color}33` : 'none',
                }}
              >
                {/* Card header */}
                <div style={{ background: type.bg, padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    right: '-20px',
                    top: '-20px',
                    fontSize: '6rem',
                    opacity: 0.1,
                    pointerEvents: 'none',
                  }}>{type.icon}</div>

                  {selected === type.id && (
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: type.color,
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '100px',
                    }}>Selected</span>
                  )}

                  <p style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{type.icon}</p>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{type.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: type.accent }}>{type.subtitle}</p>

                  <div style={{ marginTop: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>₹{type.price}</span>
                    <span style={{ fontSize: '1rem', color: type.accent, marginLeft: '0.25rem' }}>/ gram</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: `${type.accent}99`, marginTop: '0.25rem' }}>+ delivery fee</p>
                </div>

                {/* Card body */}
                <div style={{ background: 'var(--surface)', padding: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    Features
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {type.features.map((f) => (
                      <li key={f} style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: type.color, flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    Best for
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {type.usecases.map((u) => (
                      <span key={u} style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.6rem',
                        border: '1px solid var(--border)',
                        borderRadius: '100px',
                        color: 'var(--foreground-secondary)',
                        background: 'var(--background)',
                      }}>
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery note */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ fontSize: '1.25rem' }}>🚚</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', margin: 0 }}>
              <strong style={{ color: 'var(--foreground)' }}>Delivery fee</strong> is calculated based on location and parcel weight/size.
              It will be confirmed when we contact you on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container-page" style={{ maxWidth: '680px' }}>
          <div className="section-header">
            <h2 className="section-title">Place Your Order</h2>
          </div>

          {/* Selected type badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 1.25rem',
            background: selectedType.id === 'fdm' ? '#001a3a' : '#1a003a',
            border: `1px solid ${selectedType.color}33`,
            borderRadius: '8px',
            marginBottom: '2rem',
          }}>
            <span style={{ fontSize: '1.25rem' }}>{selectedType.icon}</span>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', margin: 0 }}>{selectedType.name} selected</p>
              <p style={{ fontSize: '0.8125rem', color: selectedType.accent, margin: 0 }}>₹{selectedType.price}/gram + delivery</p>
            </div>
            <button
              onClick={() => setSelected(selected === 'fdm' ? 'sla' : 'fdm')}
              style={{
                marginLeft: 'auto',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#ddd',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.35rem 0.85rem',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              Switch
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Name */}
            <div>
              <label className="label" htmlFor="print-name">Your Name *</label>
              <input
                id="print-name"
                type="text"
                className="input"
                placeholder="e.g. Rahul Nair"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label" htmlFor="print-desc">Product Description *</label>
              <textarea
                id="print-desc"
                className="input"
                placeholder="Describe what you want printed — shape, purpose, any specific requirements..."
                rows={4}
                value={form.productDescription}
                onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Dimensions + Quantity row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label" htmlFor="print-size">Approximate Size</label>
                <input
                  id="print-size"
                  type="text"
                  className="input"
                  placeholder="e.g. 10cm × 5cm × 3cm"
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="print-qty">Quantity</label>
                <input
                  id="print-qty"
                  type="number"
                  className="input"
                  min="1"
                  max="500"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="label" htmlFor="print-color">Preferred Color / Finish</label>
              <input
                id="print-color"
                type="text"
                className="input"
                placeholder="e.g. Black, White, Transparent, Any"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </div>

            {/* Reference */}
            <div>
              <label className="label" htmlFor="print-ref">Reference Link (optional)</label>
              <input
                id="print-ref"
                type="url"
                className="input"
                placeholder="Thingiverse, GrabCAD, image link..."
                value={form.referenceLink}
                onChange={(e) => setForm({ ...form, referenceLink: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="label" htmlFor="print-notes">Additional Notes</label>
              <textarea
                id="print-notes"
                className="input"
                placeholder="Layer height preference, infill density, supports needed, deadline, etc."
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Cost estimator toggle */}
            {form.dimensions && (
              <div style={{
                padding: '1rem 1.25rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
                  📊 <strong style={{ color: 'var(--foreground)' }}>Rough Estimate</strong>
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>
                  Estimated weight: ~{estimateWeight(form.dimensions)}g ×{' '}
                  ₹{selectedType.price}/gram × {form.quantity || 1} unit(s) ={' '}
                  <strong style={{ color: 'var(--foreground)' }}>
                    ₹{parseInt(estimateWeight(form.dimensions).split('–')[0]) * selectedType.price * parseInt(form.quantity || '1')} –{' '}
                    ₹{parseInt((estimateWeight(form.dimensions).split('–')[1] || estimateWeight(form.dimensions).split('–')[0])) * selectedType.price * parseInt(form.quantity || '1')}
                  </strong>{' '}
                  + delivery
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--foreground-tertiary)', marginTop: '0.375rem' }}>
                  * Final price confirmed after reviewing your 3D model
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={!isValid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: isValid ? '#25d366' : 'var(--border)',
                  color: isValid ? '#fff' : 'var(--foreground-tertiary)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (isValid) e.currentTarget.style.background = '#20b358'; }}
                onMouseLeave={(e) => { if (isValid) e.currentTarget.style.background = '#25d366'; }}
              >
                {/* WhatsApp icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Send Order via WhatsApp (+91 94006 34966)
              </button>

              <button
                type="button"
                disabled={!isValid}
                onClick={() => handleSendToWhatsApp(WHATSAPP_NUMBER_2)}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.5rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  opacity: isValid ? 1 : 0.5,
                  cursor: isValid ? 'pointer' : 'not-allowed',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Send via Alternative WhatsApp (+91 95675 88028)
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', textAlign: 'center' }}>
              We will review your request and reply within a few hours with a quote on your WhatsApp.
            </p>
          </form>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface)' }}>
        <div className="container-page">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
          }}>
            {[
              { step: '01', icon: '📝', title: 'Fill the form', desc: 'Describe your product, preferred material, size and quantity.' },
              { step: '02', icon: '💬', title: 'WhatsApp chat', desc: 'We receive your details and reply with a confirmed quote.' },
              { step: '03', icon: '💳', title: 'Pay & confirm', desc: 'Make a simple payment via UPI or WhatsApp Pay.' },
              { step: '04', icon: '📦', title: 'Receive it', desc: 'Your print is shipped or arranged for delivery across Kerala.' },
            ].map((s) => (
              <div key={s.step} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--foreground-tertiary)',
                    letterSpacing: '0.05em',
                  }}>{s.step}</span>
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>{s.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-page" style={{ maxWidth: '680px' }}>
          <div className="section-header">
            <h2 className="section-title">Common Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'What file formats do you accept?', a: 'We accept STL, OBJ, 3MF files. If you don\'t have a file, describe what you need and we\'ll source or design it for you (design fee may apply).' },
              { q: 'How long does it take?', a: 'Most prints are completed within 2–5 business days depending on complexity. Rush orders may be accommodated — mention it in your notes.' },
              { q: 'Can I see a sample before placing a bulk order?', a: 'Yes! We recommend ordering 1 sample unit first for bulk orders. Sample pricing is the same as regular pricing.' },
              { q: 'Do you deliver outside Kerala?', a: 'Currently we primarily serve Kerala. For other locations, contact us on WhatsApp and we\'ll check shipping options.' },
            ].map((faq) => (
              <div key={faq.q} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>{faq.q}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--foreground-secondary)', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
