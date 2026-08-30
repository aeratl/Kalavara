'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice, getPrimaryImageUrl } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const imageUrl = getPrimaryImageUrl(product.product_images);
  const priceText = formatPrice(product.price, product.price_display_mode);

  const availabilityConfig = {
    available: { label: 'Available', dot: '#1a7a4a' },
    check_availability: { label: 'Check Availability', dot: '#a87c0a' },
    out_of_stock: { label: 'Out of Stock', dot: '#c0392b' },
  }[product.availability];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      price: product.price,
      priceDisplayMode: product.price_display_mode,
      imageUrl,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      style={{
        display: 'block',
        background: 'var(--background)',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        style={{
          aspectRatio: '4/3',
          background: 'var(--surface)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--foreground-tertiary)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        {/* Featured badge */}
        {product.is_featured && (
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: 'var(--foreground)',
              color: 'var(--background)',
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.5rem',
              borderRadius: '2px',
            }}
          >
            Featured
          </div>
        )}

        {/* Quick Add (hover) */}
        {product.availability !== 'out_of_stock' && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              transform: hovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.2s ease',
            }}
          >
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(17,17,17,0.9)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0.875rem 0', borderTop: '1px solid var(--border)' }}>
        <p
          className="product-code"
          style={{ marginBottom: '0.25rem' }}
        >
          {product.code}
        </p>
        <h3
          style={{
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: 'var(--foreground)',
            lineHeight: '1.35',
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em',
          }}
        >
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--foreground)',
            }}
          >
            {priceText}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: availabilityConfig.dot,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--foreground-tertiary)',
              }}
            >
              {availabilityConfig.label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
