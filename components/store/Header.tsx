'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CartIcon from './CartIcon';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <>
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--background)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="container-page">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px',
              gap: '2rem',
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Image
                src="/logo.png"
                alt="EE-KALAVARA — Kerala's Digital Chandha"
                width={140}
                height={42}
                priority
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            {/* Desktop Nav */}
            <nav
              style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
              className="desktop-nav"
            >
              <NavLink href="/">Home</NavLink>
              <NavLink href="/categories">Categories</NavLink>
              <NavLink href="/categories?sort=new">New Arrivals</NavLink>
              <NavLink href="/3d-printing" badge="New">3D Printing</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/sell">Sell on Kalavara</NavLink>
            </nav>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem',
                  color: 'var(--foreground-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 'var(--radius)',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-secondary)')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              {/* Cart */}
              <CartIcon />

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
                className="mobile-menu-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem',
                  color: 'var(--foreground)',
                  display: 'none',
                  alignItems: 'center',
                  borderRadius: 'var(--radius)',
                }}
              >
                {mobileOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div
            style={{
              borderTop: '1px solid var(--border)',
              background: 'var(--background)',
              padding: '1rem 1.5rem',
            }}
            className="mobile-nav"
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <MobileNavLink href="/" onClick={() => setMobileOpen(false)}>🏠 Home</MobileNavLink>
              <MobileNavLink href="/categories" onClick={() => setMobileOpen(false)}>Categories</MobileNavLink>
              <MobileNavLink href="/categories?sort=new" onClick={() => setMobileOpen(false)}>New Arrivals</MobileNavLink>
              <MobileNavLink href="/3d-printing" onClick={() => setMobileOpen(false)}>🖨️ 3D Printing</MobileNavLink>
              <MobileNavLink href="/about" onClick={() => setMobileOpen(false)}>About</MobileNavLink>
              <MobileNavLink href="/sell" onClick={() => setMobileOpen(false)}>Sell on Kalavara</MobileNavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: '80px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 1.5rem',
            }}
          >
            <form onSubmit={handleSearch}>
              <div style={{ position: 'relative' }}>
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, codes, categories…"
                  style={{
                    width: '100%',
                    padding: '1rem 3rem 1rem 1.25rem',
                    fontSize: '1.0625rem',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    outline: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--foreground-secondary)',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </form>
            <p
              style={{
                marginTop: '0.75rem',
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.6)',
                textAlign: 'center',
              }}
            >
              Try: &quot;EK-TOY-001&quot; or &quot;toys&quot; or &quot;saree&quot;
            </p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        .mobile-nav { display: none; }
        @media (max-width: 768px) {
          .mobile-nav { display: block; }
        }
      `}</style>
    </>
  );
}

function NavLink({ href, children, badge }: { href: string; children: React.ReactNode; badge?: string }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: 'var(--foreground-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        transition: 'color 0.15s ease',
        padding: '0.25rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-secondary)')}
    >
      {children}
      {badge && (
        <span style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          background: '#1565c0',
          color: '#fff',
          padding: '0.1rem 0.4rem',
          borderRadius: '100px',
          textTransform: 'uppercase',
          lineHeight: 1.5,
        }}>{badge}</span>
      )}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        fontSize: '0.9375rem',
        fontWeight: 500,
        color: 'var(--foreground)',
        padding: '0.75rem 0',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'block',
      }}
    >
      {children}
    </Link>
  );
}
