'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/types';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import InformKalavaraModal from './InformKalavaraModal';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const [showModal, setShowModal] = useState(false);

  if (items.length === 0) {
    return (
      <div
        style={{
          padding: '6rem 1.5rem',
          textAlign: 'center',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1.5rem', color: 'var(--foreground-tertiary)' }}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your cart is empty</h2>
        <p style={{ fontSize: '0.9375rem', marginBottom: '2rem' }}>Browse our catalogue and add products you&apos;re interested in.</p>
        <a href="/categories" className="btn btn-primary">Browse Products</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem' }}>Your Cart</h1>
      <p style={{ color: 'var(--foreground-secondary)', marginBottom: '2.5rem', fontSize: '0.9375rem' }}>
        {items.length} item{items.length !== 1 ? 's' : ''} — tell us what you need and we&apos;ll contact you.
      </p>

      {/* Items */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onRemove={() => removeItem(item.productId)}
            onQuantityChange={(qty) => updateQuantity(item.productId, qty)}
          />
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: '2.5rem',
          padding: '2rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface)',
        }}
      >
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Ready to proceed?</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', marginBottom: '1.5rem', lineHeight: '1.65' }}>
          Click below and fill in your contact details. The Kalavara team will reach out via WhatsApp to confirm availability and pricing.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
        >
          Inform Kalavara
        </button>
      </div>

      {showModal && <InformKalavaraModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function CartItemRow({ item, onRemove, onQuantityChange }: {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '64px',
          height: '64px',
          flexShrink: 0,
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          position: 'relative',
        }}
      >
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.productName} fill style={{ objectFit: 'cover' }} sizes="64px" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-tertiary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="product-code" style={{ marginBottom: '0.2rem' }}>{item.productCode}</p>
        <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--foreground)', lineHeight: '1.3', marginBottom: '0.25rem' }}>{item.productName}</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)' }}>{formatPrice(item.price, item.priceDisplayMode)}</p>
      </div>

      {/* Qty + Remove */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <button
            onClick={() => onQuantityChange(item.quantity - 1)}
            style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--foreground-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span style={{ width: '32px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 500 }}>{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.quantity + 1)}
            style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--foreground-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={onRemove}
          aria-label="Remove item"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-tertiary)', display: 'flex', alignItems: 'center', padding: '4px', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-tertiary)')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
        </button>
      </div>
    </div>
  );
}
