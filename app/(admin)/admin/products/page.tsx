import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getPrimaryImageUrl } from '@/lib/utils';
import type { Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';

export default async function AdminProductsPage() {
  let products: Product[] = INITIAL_PRODUCTS;

  try {
    const supabase = await createClient();
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*, categories(*), sellers(*), product_images(*)')
      .order('created_at', { ascending: false });

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts as Product[];
    }
  } catch (err) {
    console.error('Admin products query fallback:', err);
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Products
          </h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage the catalogue, pricing, and availability
          </p>
        </div>

        <Link href="/admin/products/new" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="card" style={{ background: 'var(--background)', overflow: 'hidden' }}>
        {(!products || products.length === 0) ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--foreground-tertiary)' }}>
            <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>No products yet in the catalogue.</p>
            <Link href="/admin/products/new" className="btn btn-primary">Add Your First Product</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)', width: '64px' }}>Image</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Product</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Price</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Availability</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(products as Product[]).map((product) => {
                  const imgUrl = getPrimaryImageUrl(product.product_images);

                  return (
                    <tr
                      key={product.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Image Thumbnail */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius)',
                            background: 'var(--surface)',
                            overflow: 'hidden',
                            position: 'relative',
                            border: '1px solid var(--border)',
                          }}
                        >
                          {imgUrl ? (
                            <Image src={imgUrl} alt="" fill sizes="48px" style={{ objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground-tertiary)' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Product Name & Code */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Link href={`/admin/products/${product.id}`} style={{ fontWeight: 500, color: 'var(--foreground)', textDecoration: 'none', display: 'block', marginBottom: '0.2rem' }}>
                          {product.name}
                        </Link>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--foreground-tertiary)' }}>
                          {product.code}
                        </span>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--foreground-secondary)' }}>
                        {product.categories?.name || '—'}
                      </td>

                      {/* Price */}
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: 'var(--foreground)' }}>
                        {formatPrice(product.price, product.price_display_mode)}
                      </td>

                      {/* Availability */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          className={`badge ${
                            product.availability === 'available'
                              ? 'badge-green'
                              : product.availability === 'check_availability'
                              ? 'badge-yellow'
                              : 'badge-red'
                          }`}
                        >
                          {product.availability.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Published Status */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${product.is_published ? 'badge-green' : 'badge-gray'}`}>
                          {product.is_published ? 'Published' : 'Hidden'}
                        </span>
                        {product.is_featured && (
                          <span className="badge badge-black" style={{ marginLeft: '0.375rem' }}>
                            Featured
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="btn btn-ghost btn-sm"
                            title="View on store"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
