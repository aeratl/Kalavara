import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import AddToCartButton from '@/components/store/AddToCartButton';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import Link from 'next/link';
import { INITIAL_PRODUCTS } from '@/lib/mockData';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  let product = INITIAL_PRODUCTS.find((p) => p.slug === code || p.code.toLowerCase() === code.toLowerCase());
  try {
    const supabase = await createClient();
    const { data: dbProduct } = await supabase
      .from('products')
      .select('name, description, code')
      .eq('slug', code)
      .eq('is_published', true)
      .single();
    if (dbProduct) product = dbProduct as any;
  } catch {}

  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} — ${product.code}`,
    description: product.description || `View ${product.name} on EE-KALAVARA`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { code } = await params;
  let product = INITIAL_PRODUCTS.find((p) => p.slug === code || p.code.toLowerCase() === code.toLowerCase());

  try {
    const supabase = await createClient();
    const { data: dbProduct } = await supabase
      .from('products')
      .select('*, categories(*), sellers(*), product_images(*)')
      .eq('slug', code)
      .eq('is_published', true)
      .single();

    if (dbProduct) {
      product = dbProduct as Product;
    }
  } catch (err) {
    console.error('Product query fallback:', err);
  }

  if (!product) notFound();

  const p = product as Product;
  const images = (p.product_images || []).sort((a, b) => a.display_order - b.display_order);
  const primaryImage = images.find((img) => img.is_primary) || images[0];

  const availabilityConfig = {
    available: { label: 'Available', dot: 'var(--green)', bg: 'var(--green-bg)' },
    check_availability: { label: 'Check Availability', dot: 'var(--yellow)', bg: 'var(--yellow-bg)' },
    out_of_stock: { label: 'Out of Stock', dot: 'var(--red)', bg: 'var(--red-bg)' },
  }[p.availability];

  return (
    <div className="container-page" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>Home</Link>
        <span style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>/</span>
        {p.categories && (
          <>
            <Link href={`/categories/${p.categories.slug}`} style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>
              {p.categories.name}
            </Link>
            <span style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>/</span>
          </>
        )}
        <span style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)' }}>{p.name}</span>
      </nav>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Images */}
        <div>
          {/* Primary image */}
          <div
            style={{
              aspectRatio: '4/3',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              position: 'relative',
              marginBottom: images.length > 1 ? '0.75rem' : 0,
            }}
          >
            {primaryImage?.public_url ? (
              <Image
                src={primaryImage.public_url}
                alt={p.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-tertiary)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>
          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {images.map((img) => (
                <div
                  key={img.id}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    border: `1px solid ${img.is_primary ? 'var(--foreground)' : 'var(--border)'}`,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {img.public_url && (
                    <Image src={img.public_url} alt="" fill sizes="64px" style={{ objectFit: 'cover' }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <p className="product-code" style={{ marginBottom: '0.5rem' }}>{p.code}</p>
          <h1 style={{ fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 500, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {p.name}
          </h1>

          {/* Price */}
          <p style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {formatPrice(p.price, p.price_display_mode)}
          </p>

          {/* Availability */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: availabilityConfig.bg,
              padding: '0.375rem 0.75rem',
              borderRadius: '100px',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: availabilityConfig.dot }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: availabilityConfig.dot }}>
              {availabilityConfig.label}
            </span>
          </div>

          {/* Description */}
          {p.description && (
            <p style={{ fontSize: '0.9375rem', color: 'var(--foreground-secondary)', lineHeight: '1.75', marginBottom: '2rem' }}>
              {p.description}
            </p>
          )}

          {/* Meta */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {p.categories && (
              <MetaRow label="Category">
                <Link href={`/categories/${p.categories.slug}`} style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline', textDecorationColor: 'var(--border)' }}>
                  {p.categories.name}
                </Link>
              </MetaRow>
            )}
            {p.location && <MetaRow label="Location">{p.location}</MetaRow>}
            {p.show_seller && p.sellers && <MetaRow label="Source">{p.sellers.business_name}</MetaRow>}
          </div>

          {/* Add to Cart */}
          <AddToCartButton product={p} />

          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.8125rem',
              color: 'var(--foreground-tertiary)',
              lineHeight: '1.6',
            }}
          >
            After adding to cart, click &ldquo;Inform Kalavara&rdquo; and we&apos;ll contact you via WhatsApp to confirm availability and pricing.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-tertiary)', minWidth: '80px', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: '0.9375rem', color: 'var(--foreground-secondary)' }}>{children}</span>
    </div>
  );
}
