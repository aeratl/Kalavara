'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { buildWhatsAppUrl, isValidIndianMobile } from '@/lib/utils';

interface Props {
  onClose: () => void;
}

type Step = 'form' | 'success';

export default function InformKalavaraModal({ onClose }: Props) {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    delivery_location: '',
    instagram: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!isValidIndianMobile(form.whatsapp)) { setError('Please enter a valid WhatsApp number.'); return; }
    if (!form.delivery_location.trim()) { setError('Please enter your delivery location.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          whatsapp: form.whatsapp,
          delivery_location: form.delivery_location,
          instagram: form.instagram || null,
          message: form.message || null,
          items: items.map((i) => ({
            product_id: i.productId,
            product_code: i.productCode,
            product_name: i.productName,
            quantity: i.quantity,
            price_at_order: i.price,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');

      setReference(data.reference);
      clearCart();
      setStep('success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = reference
    ? `Hello Kalavara Team, I submitted order request ${reference}. Please confirm my order.`
    : '';

  const whatsappUrl = buildWhatsAppUrl('9400634966', whatsappMessage);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--background)',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: '2rem 1.5rem',
        }}
      >
        {step === 'form' ? (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500 }}>Inform Kalavara</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)', marginTop: '0.25rem' }}>
                  {items.length} item{items.length !== 1 ? 's' : ''} in your request
                </p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-secondary)', padding: '4px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Product summary */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '0.875rem 1rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              {items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', padding: '0.25rem 0' }}>
                  <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{item.productName}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--foreground-tertiary)' }}>×{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label" htmlFor="inf-name">Name *</label>
                <input id="inf-name" name="name" className="input" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
              <div>
                <label className="label" htmlFor="inf-whatsapp">WhatsApp Number *</label>
                <input id="inf-whatsapp" name="whatsapp" className="input" value={form.whatsapp} onChange={handleChange} placeholder="9XXXXXXXXX" type="tel" required />
              </div>
              <div>
                <label className="label" htmlFor="inf-location">Delivery Location *</label>
                <input id="inf-location" name="delivery_location" className="input" value={form.delivery_location} onChange={handleChange} placeholder="City, District, Kerala" required />
              </div>
              <div>
                <label className="label" htmlFor="inf-instagram">Instagram Username (optional)</label>
                <input id="inf-instagram" name="instagram" className="input" value={form.instagram} onChange={handleChange} placeholder="@yourhandle" />
              </div>
              <div>
                <label className="label" htmlFor="inf-message">Additional Message (optional)</label>
                <textarea id="inf-message" name="message" className="input" value={form.message} onChange={handleChange} placeholder="Any specific requirements, colour preferences, etc." rows={3} style={{ resize: 'vertical' }} />
              </div>

              {error && (
                <p style={{ color: 'var(--red)', fontSize: '0.875rem', padding: '0.625rem 0.875rem', background: 'var(--red-bg)', borderRadius: 'var(--radius)' }}>
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} />
                    Sending…
                  </span>
                ) : 'Submit Request'}
              </button>
            </form>
          </>
        ) : (
          /* Success */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--green-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>Request Received</h2>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9375rem', marginBottom: '1rem', lineHeight: '1.65' }}>
              Thank you. The Kalavara team will contact you shortly through WhatsApp.
            </p>

            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: 'var(--foreground-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>
                Order Reference
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  letterSpacing: '0.04em',
                }}
              >
                {reference}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                Message on WhatsApp (+91 94006 34966)
              </a>
              <a
                href={buildWhatsAppUrl('9567588028', whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                Alternative WhatsApp (+91 95675 88028)
              </a>
            </div>

            <button onClick={onClose} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
