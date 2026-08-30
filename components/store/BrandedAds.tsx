'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const DEMO_ADS = [
  {
    id: 'ad-1',
    brand: 'Malabar Gold & Diamonds',
    tagline: 'Crafting Kerala\'s Finest Since 1993',
    badge: 'Festive Offer',
    badgeColor: '#d4a017',
    bg: 'linear-gradient(135deg, #1a1200 0%, #3d2a00 50%, #1a1200 100%)',
    accent: '#d4a017',
    text: '#fff8e1',
    cta: 'Explore Collection',
    href: '#',
    emoji: '💎',
    desc: 'Up to 25% off on Diamond Jewellery this Onam Season',
  },
  {
    id: 'ad-2',
    brand: 'Kerala Ayurveda',
    tagline: 'Authentic Wellness from God\'s Own Country',
    badge: 'Trusted Brand',
    badgeColor: '#2e7d32',
    bg: 'linear-gradient(135deg, #0a2e0a 0%, #1b5e20 50%, #0a2e0a 100%)',
    accent: '#81c784',
    text: '#e8f5e9',
    cta: 'Shop Wellness',
    href: '#',
    emoji: '🌿',
    desc: 'Traditional formulations, modernised for everyday health',
  },
  {
    id: 'ad-3',
    brand: 'Kalyan Silks',
    tagline: 'The Pride of Kerala Handlooms',
    badge: 'Heritage Brand',
    badgeColor: '#b71c1c',
    bg: 'linear-gradient(135deg, #1a0000 0%, #4a0000 50%, #1a0000 100%)',
    accent: '#ef9a9a',
    text: '#fce4ec',
    cta: 'View Sarees',
    href: '#',
    emoji: '🧵',
    desc: 'Authentic Kanjivaram, Kasavu & Silk sarees — straight from the loom',
  },
  {
    id: 'ad-4',
    brand: 'Kitex Garments',
    tagline: 'Made in Kerala. Worn by the World.',
    badge: 'Featured',
    badgeColor: '#1565c0',
    bg: 'linear-gradient(135deg, #001a3a 0%, #003080 50%, #001a3a 100%)',
    accent: '#90caf9',
    text: '#e3f2fd',
    cta: 'Shop Fashion',
    href: '#',
    emoji: '👕',
    desc: 'Everyday essentials crafted with pride from Kizhakkambalam',
  },
];

export default function BrandedAds() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % DEMO_ADS.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const ad = DEMO_ADS[active];

  return (
    <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container-page">
        {/* Header */}
        <div className="section-header">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              background: '#ef4444',
              borderRadius: '50%',
              animation: 'adPulse 1.5s ease-in-out infinite',
            }} />
            Featured Brands
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>Sponsored</p>
        </div>

        {/* Ad Banner */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            background: ad.bg,
            minHeight: '220px',
            display: 'flex',
            alignItems: 'center',
            transition: 'background 0.6s ease',
            cursor: 'pointer',
          }}
        >
          {/* Noise texture overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            backgroundSize: '200px',
            opacity: 0.5,
            pointerEvents: 'none',
          }} />

          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            right: '-60px',
            top: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            border: `1px solid ${ad.accent}22`,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            right: '-20px',
            top: '-20px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: `1px solid ${ad.accent}33`,
            pointerEvents: 'none',
          }} />

          {/* Emoji watermark */}
          <div style={{
            position: 'absolute',
            right: '2rem',
            fontSize: '7rem',
            opacity: 0.12,
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 1,
          }}>
            {ad.emoji}
          </div>

          {/* Content */}
          <div style={{ position: 'relative', padding: '2.5rem 2rem', flex: 1 }}>
            {/* Badge */}
            <span style={{
              display: 'inline-block',
              background: ad.badgeColor,
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.6rem',
              borderRadius: '100px',
              marginBottom: '1rem',
            }}>
              {ad.badge}
            </span>

            {/* Brand Name */}
            <h3 style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              color: ad.text,
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem',
              lineHeight: 1.2,
            }}>
              {ad.brand}
            </h3>

            {/* Tagline */}
            <p style={{
              fontSize: '0.875rem',
              color: ad.accent,
              marginBottom: '0.75rem',
              fontWeight: 500,
            }}>
              {ad.tagline}
            </p>

            {/* Desc */}
            <p style={{
              fontSize: '0.875rem',
              color: `${ad.text}bb`,
              marginBottom: '1.5rem',
              maxWidth: '420px',
              lineHeight: 1.6,
            }}>
              {ad.desc}
            </p>

            {/* CTA */}
            <Link
              href={ad.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: ad.accent,
                color: '#000',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.6rem 1.25rem',
                borderRadius: '6px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {ad.cta}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
          {DEMO_ADS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to ad ${i + 1}`}
              style={{
                width: i === active ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === active ? 'var(--foreground)' : 'var(--border)',
                border: 'none',
                padding: 0,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Brand strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1.5rem',
          overflow: 'hidden',
          flexWrap: 'wrap',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--foreground-tertiary)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>
            Also on Kalavara:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['Malabar Gold', 'Kerala Ayurveda', 'Kalyan Silks', 'Kitex', 'Kairali', 'Mathrubhumi Books', 'Nirapara'].map((brand) => (
              <span key={brand} style={{
                fontSize: '0.8125rem',
                color: 'var(--foreground-secondary)',
                padding: '0.25rem 0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '100px',
                background: 'var(--surface)',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--foreground)';
                  e.currentTarget.style.color = 'var(--background)';
                  e.currentTarget.style.borderColor = 'var(--foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--surface)';
                  e.currentTarget.style.color = 'var(--foreground-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes adPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
