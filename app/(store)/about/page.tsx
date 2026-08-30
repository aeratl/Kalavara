import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About EE-KALAVARA',
  description: "Learn about EE-KALAVARA — Kerala's Digital Chandha. How we work, our mission, and how we connect customers with local products.",
};

export default function AboutPage() {
  return (
    <div className="container-page" style={{ padding: '4rem 1.5rem 6rem', maxWidth: '720px' }}>
      <p className="product-code" style={{ marginBottom: '1rem' }}>About</p>
      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.025em', marginBottom: '1.5rem', lineHeight: 1.2 }}>
        EE-KALAVARA<br />Kerala&apos;s Digital Chandha
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Section title="What is EE-KALAVARA?">
          <p>
            EE-KALAVARA (ഈ കലവറ) is Kerala&apos;s curated digital marketplace — a chandha for products from local offline shops, online suppliers, independent designers, manufacturers, and 3D-printing businesses.
          </p>
          <p style={{ marginTop: '1rem' }}>
            &ldquo;Kalavaraa&rdquo; means a pantry or storehouse in Malayalam — a place where things are kept with care. EE-KALAVARA is exactly that, but digital.
          </p>
        </Section>

        <Section title="How it works">
          <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              'You browse and find products you like.',
              'Add them to your cart.',
              'Click "Inform Kalavara" and share your details.',
              'The Kalavara team contacts you via WhatsApp.',
              'We verify availability and confirm pricing with the source.',
              'You receive payment instructions.',
              'We purchase, package, and arrange delivery.',
              'Product arrives at your door.',
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
        </Section>

        <Section title="Why no checkout?">
          <p>
            EE-KALAVARA operates as a curated chandha, not an automated shopping cart. This means the Kalavara team personally verifies every product&apos;s availability, confirms the price with the source, and facilitates the transaction — ensuring quality at every step.
          </p>
          <p style={{ marginTop: '1rem' }}>
            There is no automated payment in this version. You pay only after the Kalavara team confirms everything with you directly.
          </p>
        </Section>

        <Section title="Contact">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ContactRow icon="whatsapp" label="WhatsApp (Primary)" value="+91 94006 34966" href="https://wa.me/919400634966" />
            <ContactRow icon="whatsapp" label="WhatsApp (Support)" value="+91 95675 88028" href="https://wa.me/919567588028" />
            <ContactRow icon="email" label="Email" value="eekalavara@gmail.com" href="mailto:eekalavara@gmail.com" />
          </div>
        </Section>
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <Link href="/" className="btn btn-secondary">← Back to Home</Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--foreground-tertiary)', marginBottom: '0.875rem' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ContactRow({ label, value, href, icon }: { label: string; value: string; href: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card hover:border-[var(--foreground)] transition-default"
      style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none', padding: '0.875rem 1rem' }}
    >
      <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon === 'whatsapp' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#1a7a4a' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--foreground-secondary)' }}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
        )}
      </span>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--foreground-tertiary)', marginBottom: '0.125rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--foreground)', fontWeight: 500 }}>{value}</p>
      </div>
    </a>
  );
}
