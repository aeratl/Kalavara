'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartIcon() {
  const totalItems = useCart((state) => state.totalItems());

  return (
    <Link
      href="/cart"
      aria-label={`Cart (${totalItems} items)`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
        color: 'var(--foreground-secondary)',
        borderRadius: 'var(--radius)',
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-secondary)')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {totalItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: 'var(--foreground)',
            color: 'var(--background)',
            borderRadius: '100px',
            fontSize: '0.625rem',
            fontWeight: 600,
            minWidth: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
            lineHeight: 1,
          }}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
