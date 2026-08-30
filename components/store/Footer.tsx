'use client';

import Link from 'next/link';
import Image from 'next/image';


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--background)',
        marginTop: '6rem',
      }}
    >
      <div className="container-page">
        {/* Main Footer */}
        <div
          style={{
            padding: '3rem 0 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: '1 / -1', maxWidth: '280px' }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <Image
                src="/logo.png"
                alt="EE-KALAVARA"
                width={120}
                height={36}
                style={{ height: '30px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.7', color: 'var(--foreground-secondary)', maxWidth: '240px' }}>
              Kerala&apos;s curated digital marketplace — connecting you with the best local products, handpicked with care.
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>
              eekalavara@gmail.com
            </p>
          </div>

          {/* Shop */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--foreground)' }}>
              Shop
            </p>
            <FooterLinks links={[
              { href: '/categories', label: 'All Categories' },
              { href: '/categories/toys', label: 'Toys' },
              { href: '/categories/fashion', label: 'Fashion' },
              { href: '/categories/electronics', label: 'Electronics' },
              { href: '/categories/home', label: 'Home' },
              { href: '/categories/3d-products', label: '3D Products' },
              { href: '/3d-printing', label: '3D Printing Service' },
            ]} />
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--foreground)' }}>
              Info
            </p>
            <FooterLinks links={[
              { href: '/about', label: 'About Kalavara' },
              { href: '/sell', label: 'Sell on Kalavara' },
              { href: '/cart', label: 'Your Cart' },
            ]} />
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', color: 'var(--foreground)' }}>
              Contact
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <a
                href="https://wa.me/919400634966"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-secondary)')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp — +91 94006 34966
              </a>
              <a
                href="https://wa.me/919567588028"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-secondary)')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp — +91 95675 88028
              </a>
              <a
                href="mailto:eekalavara@gmail.com"
                style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-secondary)')}
              >
                eekalavara@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.25rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>
            © {currentYear} EE-KALAVARA. Kerala&apos;s Digital Chandha.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', fontFamily: 'var(--font-mono)' }}>
            ഈ കലവറ
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-secondary)')}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
