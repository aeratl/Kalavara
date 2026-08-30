import type { Metadata } from 'next';
import { buildWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Sell on EE-KALAVARA',
  description: "List your products on Kerala's Digital Chandha. Contact the Kalavara team to get your products verified and listed.",
};

const MESSAGE = `Hello Kalavara Team! I'd like to list my products on EE-KALAVARA. Please let me know the process.`;
const WHATSAPP_URL = buildWhatsAppUrl('9400634966', MESSAGE);

export default function SellPage() {
  return (
    <div className="container-page" style={{ padding: '5rem 1.5rem 6rem', maxWidth: '600px' }}>
      <p className="product-code" style={{ marginBottom: '1rem' }}>For Sellers</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.025em', marginBottom: '1.25rem', lineHeight: 1.2 }}>
        Want to list your products on Kerala&apos;s Digital Chandha?
      </h1>
      <p style={{ fontSize: '1.0625rem', color: 'var(--foreground-secondary)', lineHeight: '1.75', marginBottom: '3rem', maxWidth: '480px' }}>
        EE-KALAVARA is a curated marketplace. Every product is personally reviewed and listed by the Kalavara team. We work with local shops, independent designers, manufacturers, and 3D-printing businesses.
      </p>

      {/* How it works for sellers */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--foreground-tertiary)', marginBottom: '1.25rem' }}>
          How Seller Listing Works
        </h2>
        <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            'Contact the Kalavara team via WhatsApp or email.',
            'Share details about your products, pricing, and location.',
            'The Kalavara team reviews and verifies your products.',
            'Approved products are listed with a unique EK code.',
            'When a customer orders, we coordinate with you directly.',
          ].map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span
                style={{
                  flexShrink: 0,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--foreground-tertiary)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.9375rem', color: 'var(--foreground-secondary)', paddingTop: '0.125rem', lineHeight: '1.6' }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Who can sell */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--foreground-tertiary)', marginBottom: '1.25rem' }}>
          Who Can Sell on Kalavara?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.625rem' }}>
          {['Local offline shops', 'Online suppliers', 'Independent designers', 'Manufacturers', '3D printing studios', 'Home-based sellers'].map((type) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
              <span style={{ color: 'var(--green)', fontSize: '0.875rem' }}>✓</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)' }}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', textDecoration: 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          Contact Kalavara on WhatsApp (+91 94006 34966)
        </a>
        <a
          href="https://wa.me/919567588028?text=Hello%20Kalavara%20Team!%20I'd%20like%20to%20list%20my%20products%20on%20EE-KALAVARA.%20Please%20let%20me%20know%20the%20process."
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-lg"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', textDecoration: 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          Alternative WhatsApp (+91 95675 88028)
        </a>
        <a
          href="mailto:eekalavara@gmail.com?subject=Sell on EE-KALAVARA&body=Hello Kalavara Team, I would like to list my products on EE-KALAVARA."
          className="btn btn-secondary btn-lg"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', textDecoration: 'none' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          Email Us
        </a>
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', textAlign: 'center' }}>
        eekalavara@gmail.com · +91 94006 34966 · +91 95675 88028
      </p>
    </div>
  );
}
