'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MARQUEE_ITEMS = [
  'Toys', 'Fashion', 'Handlooms', 'Electronics', 'Home Decor',
  'Gifts', '3D Prints', 'Jewellery', 'Accessories', 'Books',
];

export default function HomeHero() {
  const [query, setQuery] = useState('');
  const [tick, setTick] = useState(0);
  const router = useRouter();

  // subtle animated word cycling
  const WORDS = ["Curated.", "Local.", "Authentic.", "Kerala's."];
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % WORDS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════
          FULL-SCREEN HERO
      ═══════════════════════════════════════════ */}
      <section className="hh-root">
        {/* Background: subtle warm Kerala-toned gradient + grid */}
        <div className="hh-bg" aria-hidden="true">
          <div className="hh-bg-gradient" />
          <div className="hh-bg-grid" />
          <div className="hh-bg-glow hh-bg-glow-1" />
          <div className="hh-bg-glow hh-bg-glow-2" />
        </div>

        <div className="container-page hh-inner">

          {/* ── Top badge ────────────────────────── */}
          <div className="hh-badge-row">
            <span className="hh-badge-pill">
              <span className="hh-badge-dot" />
              Kerala&apos;s Digital Chandha
            </span>
          </div>

          {/* ── LOGO — the star of the show ──────── */}
          <div className="hh-logo-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Ee Kalavara — Kerala's Digital Chandha"
              className="hh-logo-img"
            />
          </div>

          {/* ── Animated sub-headline ────────────── */}
          <div className="hh-headline">
            <span className="hh-word-cycle" key={tick}>{WORDS[tick]}</span>
            {' '}Products from local Kerala shops,<br className="hh-br" />
            designers &amp; makers — all in one place.
          </div>

          {/* ── Search ───────────────────────────── */}
          <form onSubmit={handleSearch} className="hh-search-form" aria-label="Search products">
            <div className="hh-search-box">
              <svg className="hh-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="home-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, codes, categories…"
                className="hh-search-input"
                autoComplete="off"
              />
              <button type="submit" className="hh-search-btn">Search</button>
            </div>
          </form>

          {/* ── CTAs ─────────────────────────────── */}
          <div className="hh-ctas">
            <Link href="/categories" className="hh-cta-primary">
              Shop Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/3d-printing" className="hh-cta-secondary">
              🖨️ 3D Printing Service
            </Link>
          </div>

          {/* ── Stats row ────────────────────────── */}
          <div className="hh-stats">
            {[
              { n: '500+', l: 'Products' },
              { n: '50+', l: 'Local Sellers' },
              { n: '7', l: 'Categories' },
              { n: 'Kerala', l: 'Wide Delivery' },
            ].map((s) => (
              <div key={s.l} className="hh-stat">
                <span className="hh-stat-n">{s.n}</span>
                <span className="hh-stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scrolling marquee ───────────────── */}
        <div className="hh-marquee-wrap" aria-hidden="true">
          <div className="hh-marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="hh-marquee-item">
                {item}
                <span className="hh-marquee-sep">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3D PRINTING PROMO STRIP
      ═══════════════════════════════════════════ */}
      <section className="hh-print-strip-section">
        <div className="container-page">
          <Link href="/3d-printing" className="hh-print-strip">
            {/* Left glow */}
            <div className="hh-print-glow" aria-hidden="true" />

            <div className="hh-print-left">
              <span className="hh-print-badge">✦ New Service</span>
              <h2 className="hh-print-title">🖨️ 3D Printing, On Demand in Kerala</h2>
              <p className="hh-print-desc">
                <strong>FDM — ₹6/gram</strong> &nbsp;·&nbsp; <strong>SLA — ₹12/gram</strong> &nbsp;·&nbsp; + Delivery fee
              </p>
              <p className="hh-print-sub">Describe your product → We quote → Print → Deliver</p>
            </div>

            <div className="hh-print-right">
              <span className="hh-print-cta">
                Get a Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>

            {/* Decorative circles */}
            <div className="hh-print-circle hh-print-circle-a" aria-hidden="true" />
            <div className="hh-print-circle hh-print-circle-b" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STYLES
      ═══════════════════════════════════════════ */}
      <style>{`
        /* ─── ROOT ──────────────────────────────── */
        .hh-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }

        /* ─── BACKGROUND ────────────────────────── */
        .hh-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .hh-bg-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 100% 70% at 60% 0%, #fff8f0 0%, #ffffff 60%);
        }
        .hh-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--border-subtle) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 10%, black 30%, transparent 90%);
          opacity: 0.6;
        }
        .hh-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
        }
        .hh-bg-glow-1 {
          width: 500px; height: 500px;
          right: -100px; top: -100px;
          background: radial-gradient(circle, #ffe0b2, transparent 70%);
        }
        .hh-bg-glow-2 {
          width: 400px; height: 400px;
          left: -80px; bottom: 0;
          background: radial-gradient(circle, #e8f5e9, transparent 70%);
        }

        /* ─── INNER ─────────────────────────────── */
        .hh-inner {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 5rem;
          padding-bottom: 3rem;
          gap: 0;
        }

        /* ─── BADGE ROW ─────────────────────────── */
        .hh-badge-row {
          margin-bottom: 2rem;
        }
        .hh-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
          color: var(--foreground-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.375rem 0.875rem;
          border-radius: 100px;
        }
        .hh-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #e53935;
          animation: hhDotPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes hhDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }

        /* ─── LOGO ──────────────────────────────── */
        .hh-logo-block {
          margin-bottom: 2rem;
        }
        .hh-logo-img {
          display: block;
          width: min(340px, 60vw);
          height: auto;
          object-fit: contain;
          max-width: 100%;
        }

        /* ─── HEADLINE ──────────────────────────── */
        .hh-headline {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: var(--foreground-secondary);
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 2.5rem;
        }
        .hh-word-cycle {
          display: inline-block;
          font-weight: 700;
          color: var(--foreground);
          animation: hhWordIn 0.4s ease both;
        }
        @keyframes hhWordIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hh-br { display: block; }

        /* ─── SEARCH ────────────────────────────── */
        .hh-search-form {
          max-width: 520px;
          margin-bottom: 2rem;
        }
        .hh-search-box {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .hh-search-box:focus-within {
          border-color: var(--foreground);
          box-shadow: 0 0 0 3px rgba(17,17,17,0.07);
        }
        .hh-search-icon {
          flex-shrink: 0;
          margin: 0 0.875rem;
          color: var(--foreground-tertiary);
        }
        .hh-search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.875rem 0.5rem;
          font-size: 0.9375rem;
          color: var(--foreground);
          background: transparent;
          font-family: var(--font-sans);
        }
        .hh-search-input::placeholder { color: var(--foreground-tertiary); }
        .hh-search-btn {
          flex-shrink: 0;
          background: var(--foreground);
          color: var(--background);
          border: none;
          padding: 0.875rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: var(--font-sans);
          transition: background 0.15s ease;
          border-left: 1.5px solid var(--border);
        }
        .hh-search-btn:hover { background: #333; }

        /* ─── CTAS ──────────────────────────────── */
        .hh-ctas {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3.5rem;
          flex-wrap: wrap;
        }
        .hh-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--foreground);
          color: var(--background);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.75rem 1.75rem;
          border-radius: 8px;
          transition: background 0.15s ease, transform 0.15s ease;
          text-decoration: none;
        }
        .hh-cta-primary:hover { background: #333; transform: translateY(-1px); }
        .hh-cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: var(--foreground-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          transition: all 0.15s ease;
          text-decoration: none;
        }
        .hh-cta-secondary:hover {
          border-color: var(--foreground-tertiary);
          color: var(--foreground);
          background: var(--surface);
        }

        /* ─── STATS ─────────────────────────────── */
        .hh-stats {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .hh-stat {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .hh-stat-n {
          font-size: 1.375rem;
          font-weight: 800;
          color: var(--foreground);
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .hh-stat-l {
          font-size: 0.7rem;
          color: var(--foreground-tertiary);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ─── MARQUEE ───────────────────────────── */
        .hh-marquee-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow: hidden;
          border-top: 1px solid var(--border-subtle);
          padding: 0.875rem 0;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(4px);
        }
        .hh-marquee-track {
          display: flex;
          width: max-content;
          animation: hhMarquee 28s linear infinite;
        }
        .hh-marquee-item {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--foreground-tertiary);
          padding: 0 1.25rem;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .hh-marquee-sep {
          opacity: 0.4;
          font-size: 1rem;
          font-weight: 300;
        }
        @keyframes hhMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }

        /* ═══════════════════════════════════════
           3D PRINTING STRIP
        ═══════════════════════════════════════ */
        .hh-print-strip-section {
          padding: 1.5rem 0;
          background: var(--surface);
          border-bottom: 1px solid var(--border-subtle);
        }
        .hh-print-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 2rem 2.5rem;
          background: linear-gradient(135deg, #0d0d1a 0%, #0a1628 50%, #0d0d1a 100%);
          border-radius: 14px;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hh-print-strip:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.18);
        }
        .hh-print-glow {
          position: absolute;
          left: -40px; top: -40px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(79,195,247,0.15), transparent 70%);
          pointer-events: none;
        }
        .hh-print-left { position: relative; z-index: 1; }
        .hh-print-badge {
          display: inline-block;
          background: #4fc3f7;
          color: #000;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.2rem 0.65rem;
          border-radius: 100px;
          margin-bottom: 0.875rem;
        }
        .hh-print-title {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        .hh-print-desc {
          font-size: 0.9375rem;
          color: #4fc3f7;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }
        .hh-print-sub {
          font-size: 0.8125rem;
          color: #666;
        }
        .hh-print-right {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }
        .hh-print-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #4fc3f7;
          color: #000;
          font-size: 0.875rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          white-space: nowrap;
          transition: background 0.15s ease;
        }
        .hh-print-strip:hover .hh-print-cta { background: #81d4fa; }
        .hh-print-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .hh-print-circle-a {
          width: 260px; height: 260px;
          right: -80px; top: -80px;
          border: 1px solid rgba(79,195,247,0.12);
        }
        .hh-print-circle-b {
          width: 180px; height: 180px;
          right: -30px; top: -30px;
          border: 1px solid rgba(79,195,247,0.08);
        }

        /* ─── RESPONSIVE ────────────────────────── */
        @media (max-width: 640px) {
          .hh-root { min-height: 90vh; }
          .hh-logo-img { height: 72px !important; }
          .hh-stats { gap: 1.5rem; }
          .hh-stat-n { font-size: 1.125rem; }
          .hh-br { display: none; }
          .hh-print-strip { flex-direction: column; align-items: flex-start; padding: 1.5rem; }
          .hh-print-cta { width: 100%; justify-content: center; }
        }
        @media (min-width: 1024px) {
          .hh-inner { padding-top: 6rem; padding-bottom: 4rem; }
        }
      `}</style>
    </>
  );
}
